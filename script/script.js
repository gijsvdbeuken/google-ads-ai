function main() {
  // Email van ontvanger
  var emailReceiver = "gijs@kantoor.geen-gedoe.nl";

  // Periode van data
  var startDate = new Date("2024-09-01"); // Formaat: JJJJ-MM-DD
  var endDate = new Date("2024-09-14"); // Formaat: JJJJ-MM-DD

  var csvData = [];
  var timeZone = AdsApp.currentAccount().getTimeZone();

  if (isNaN(startDate) || isNaN(endDate) || startDate > endDate) {
    Logger.log("Invalid date range provided.");
    return;
  }

  csvData.push([
    "Campaign Name",
    "Ad Group Name",
    "Day",
    "Date",
    "Clicks",
    "Impressions",
    "Cost",
    "Conversions",
    "Cost per Conversion",
    "CTR",
  ]);

  var campaignIterator = AdsApp.campaigns()
    .withCondition("Status = ENABLED")
    .get();

  while (campaignIterator.hasNext()) {
    var campaign = campaignIterator.next();
    var campaignName = campaign.getName();
    var adGroupIterator = campaign.adGroups().get();

    while (adGroupIterator.hasNext()) {
      var adGroup = adGroupIterator.next();
      var adGroupName = adGroup.getName();
      var adIterator = adGroup.ads().get();

      while (adIterator.hasNext()) {
        var ad = adIterator.next();

        var currentDate = new Date(startDate);
        while (currentDate <= endDate) {
          var dateString = Utilities.formatDate(
            currentDate,
            timeZone,
            "yyyyMMdd"
          );

          try {
            var stats = ad.getStatsFor(dateString, dateString);
            var clicks = stats.getClicks();
            var impressions = stats.getImpressions();
            var cost = stats.getCost();
            var conversions = stats.getConversions();
            var costPerConversion = conversions > 0 ? cost / conversions : 0;
            var ctr =
              impressions > 0
                ? ((clicks / impressions) * 100).toFixed(2)
                : "0.00";

            csvData.push([
              campaignName,
              adGroupName,
              getDayName(currentDate.getDay()),
              Utilities.formatDate(currentDate, timeZone, "yyyy-MM-dd"),
              clicks,
              impressions,
              cost,
              conversions,
              costPerConversion.toFixed(2),
              ctr,
            ]);
          } catch (e) {
            Logger.log("Error: " + e.message);
          }

          currentDate.setDate(currentDate.getDate() + 1);
        }
      }
    }
  }

  csvData.push(["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]);
  csvData.push([
    "Campaign Name",
    "Gender",
    "Impressions",
    "Clicks",
    "Conversions",
  ]);

  var genderReport = AdsApp.report(
    "SELECT CampaignName, Criteria, Impressions, Clicks, Conversions " +
      "FROM GENDER_PERFORMANCE_REPORT " +
      "WHERE Impressions > 0 AND Date >= '" +
      Utilities.formatDate(startDate, timeZone, "yyyyMMdd") +
      "' " +
      "AND Date <= '" +
      Utilities.formatDate(endDate, timeZone, "yyyyMMdd") +
      "'"
  );

  var genderRows = genderReport.rows();
  while (genderRows.hasNext()) {
    var row = genderRows.next();
    csvData.push([
      row["CampaignName"],
      row["Criteria"],
      row["Impressions"],
      row["Clicks"],
      row["Conversions"],
    ]);
  }

  csvData.push(["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]);
  csvData.push([
    "Campaign Name",
    "Age Range",
    "Impressions",
    "Clicks",
    "Conversions",
  ]);

  var ageReport = AdsApp.report(
    "SELECT CampaignName, Criteria, Impressions, Clicks, Conversions " +
      "FROM AGE_RANGE_PERFORMANCE_REPORT " +
      "WHERE Impressions > 0 AND Date >= '" +
      Utilities.formatDate(startDate, timeZone, "yyyyMMdd") +
      "' " +
      "AND Date <= '" +
      Utilities.formatDate(endDate, timeZone, "yyyyMMdd") +
      "'"
  );

  var ageRows = ageReport.rows();
  while (ageRows.hasNext()) {
    var row = ageRows.next();
    csvData.push([
      row["CampaignName"],
      row["Criteria"],
      row["Impressions"],
      row["Clicks"],
      row["Conversions"],
    ]);
  }

  var accountName = AdsApp.currentAccount().getName();
  var currentDate = new Date();
  var timeZone = AdsApp.currentAccount().getTimeZone();
  var formattedDate = Utilities.formatDate(currentDate, timeZone, "dd-MM-yyyy");
  var formattedTime = Utilities.formatDate(currentDate, timeZone, "HH:mm:ss");

  var startDay = String(startDate.getDate() + 1).padStart(2, "0");
  var startMonth = String(startDate.getMonth() + 1).padStart(2, "0");
  var startYear = startDate.getFullYear();
  var formattedStartDate = `${startDay}-${startMonth}-${startYear}`;
  var endDay = String(endDate.getDate() + 1).padStart(2, "0");
  var endMonth = String(endDate.getMonth() + 1).padStart(2, "0");
  var endYear = endDate.getFullYear();
  var formattedEndDate = `${endDay}-${endMonth}-${endYear}`;

  var fileName =
    "Google_Ads_Data_" +
    accountName +
    "_tussen_" +
    formattedStartDate +
    "_en_" +
    formattedEndDate +
    ".csv";
  var fileContent = csvData.map((row) => row.join(",")).join("\n");
  var file = DriveApp.createFile(fileName, fileContent);

  MailApp.sendEmail({
    to: emailReceiver,
    subject: "Google Ads Data van " + accountName,
    body:
      "In de bijlage bevindt zich de CSV data van alle campagnes van " +
      accountName +
      " in de periode tussen " +
      formattedStartDate +
      " en " +
      formattedEndDate +
      ", opgehaald op " +
      formattedDate +
      " om " +
      formattedTime +
      ".",
    attachments: [file.getAs(MimeType.CSV)],
  });

  Logger.log(
    `Hoppa, data succesvol opgehaald! Controleer ${emailReceiver} om de data te downloaden.`
  );
}

function getDayName(dayIndex) {
  var days = [
    "Zondag",
    "Maandag",
    "Dinsdag",
    "Woensdag",
    "Donderdag",
    "Vrijdag",
    "Zaterdag",
  ];
  return days[dayIndex];
}
