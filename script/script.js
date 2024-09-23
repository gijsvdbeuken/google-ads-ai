function main() {
  var startDate = '20240701'; // Formaat: JJJJMMDD
  var endDate = '20240731'; // Formaat: JJJJMMDD
  var emailRecipient = 'gijs@kantoor.geen-gedoe.nl'; // Ontvanger
  var ageRangeCsvData = [],
    ageRangeSummaryCsvData = [],
    deviceCsvData = [],
    genderCsvData = [],
    genderSummaryCsvData = [],
    dayCsvData = [],
    summaryCsvData = [];
  var totalImpressions = 0,
    totalClicks = 0,
    totalCost = 0,
    totalConversions = 0;
  var campaignTotals = {};

  ageRangeCsvData.push(['CampagneNaam', 'Advertentiegroepnaam', 'Leeftijd', 'Impressies', 'Kliks', 'CTR', 'Kosten', 'Conversies', 'KostenPerConversie'].join(','));
  ageRangeSummaryCsvData.push(['CampagneNaam', 'Leeftijd', 'TotaalImpressies', 'TotaalKliks', 'TotaalKosten', 'TotaalConversies', 'GemiddeldeCTR', 'GemiddeldeCPC', 'GemiddeldeKostenPerConversie'].join(','));
  deviceCsvData.push(['CampagneNaam', 'Device', 'Impressies', 'Kliks', 'CTR', 'Kosten', 'Conversies', 'KostenPerConversie'].join(','));
  genderCsvData.push(['CampagneNaam', 'AdvertentiegroepNaam', 'Gender', 'Impressies', 'Kliks', 'CTR', 'Kosten', 'Conversies', 'KostenPerConversie'].join(','));
  genderSummaryCsvData.push(['CampagneNaam', 'Gender', 'TotaalImpressies', 'TotaalKliks', 'TotaalKosten', 'TotaalConversies', 'GemiddeldeCTR', 'GemiddeldeCPC', 'GemiddeldeKostenPerConversie'].join(','));
  dayCsvData.push(['CampagneNaam', 'DagVanDeWeek', 'Impressies', 'Kliks', 'CTR', 'Kosten', 'Conversies', 'KostenPerConversie'].join(','));
  summaryCsvData.push(['AantalCampagnes', 'KliksTotaal', 'ImpressiesTotaal', 'KostenTotaal', 'ConversiesTotaal', 'CTR_Gemiddeld', 'CPC_Gemiddeld', 'KostenPerConversie_Gemiddeld'].join(','));
  // AGE RANGE & AGE RANGE SUMMARY REPORT

  var ageRangeReport = AdsApp.report('SELECT CampaignName, AdGroupName, Criteria, Impressions, Clicks, Cost, Conversions ' + 'FROM AGE_RANGE_PERFORMANCE_REPORT ' + "WHERE Impressions > 0 AND CampaignStatus = 'ENABLED'" + 'DURING ' + startDate.replace(/-/g, '') + ',' + endDate.replace(/-/g, ''));
  var ageMap = {
    AGE_RANGE_18_24: '18-24',
    AGE_RANGE_25_34: '25-34',
    AGE_RANGE_35_44: '35-44',
    AGE_RANGE_45_54: '45-54',
    AGE_RANGE_55_64: '55-64',
    AGE_RANGE_65_UP: '65+',
    AGE_RANGE_UNDETERMINED: 'Onbekend',
  };

  var campaignAgeTotals = {};

  var ageRangeRows = ageRangeReport.rows();
  while (ageRangeRows.hasNext()) {
    var row = ageRangeRows.next();
    var campaignName = row['CampaignName'];
    var ageRange = ageMap[row['Criteria']] || row['Criteria'];
    var impressions = parseFloat(row['Impressions']);
    var clicks = parseFloat(row['Clicks']);
    var cost = parseFloat(row['Cost']);
    var conversions = parseFloat(row['Conversions']);
    var ctr = impressions > 0 ? (clicks / impressions) * 100 : 0;
    var costPerConversion = conversions > 0 ? cost / conversions : 0;

    totalImpressions += impressions;
    totalClicks += clicks;
    totalCost += cost;
    totalConversions += conversions;

    if (!campaignAgeTotals[campaignName]) {
      campaignAgeTotals[campaignName] = {};
    }
    if (!campaignAgeTotals[campaignName][ageRange]) {
      campaignAgeTotals[campaignName][ageRange] = { impressions: 0, clicks: 0, cost: 0, conversions: 0 };
    }

    var ageTotal = campaignAgeTotals[campaignName][ageRange];
    ageTotal.impressions += impressions;
    ageTotal.clicks += clicks;
    ageTotal.cost += cost;
    ageTotal.conversions += conversions;

    ageRangeCsvData.push([campaignName, row['AdGroupName'], ageRange, impressions, clicks, ctr.toFixed(2), cost.toFixed(2), conversions.toFixed(0), costPerConversion.toFixed(2)].join(','));
  }

  for (var campaign in campaignAgeTotals) {
    for (var ageRange in campaignAgeTotals[campaign]) {
      var totals = campaignAgeTotals[campaign][ageRange];
      var avgCtr = totals.impressions > 0 ? (totals.clicks / totals.impressions) * 100 : 0;
      var avgCpc = totals.clicks > 0 ? totals.cost / totals.clicks : 0;
      var avgCostPerConversion = totals.conversions > 0 ? totals.cost / totals.conversions : 0;

      ageRangeSummaryCsvData.push([campaign, ageRange, totals.impressions.toFixed(0), totals.clicks.toFixed(0), totals.cost.toFixed(2), totals.conversions.toFixed(0), avgCtr.toFixed(2), avgCpc.toFixed(2), avgCostPerConversion.toFixed(2)].join(','));
    }
  }

  // DEVICE REPORT

  var deviceReport = AdsApp.report('SELECT CampaignName, Device, Impressions, Clicks, Cost, Conversions ' + 'FROM CAMPAIGN_PERFORMANCE_REPORT ' + "WHERE Impressions > 0 AND CampaignStatus = 'ENABLED'" + 'DURING ' + startDate.replace(/-/g, '') + ',' + endDate.replace(/-/g, ''));

  var deviceMap = {
    Computers: 'Computer',
    'Mobile devices with full browsers': 'Telefoon',
    'Tablets with full browsers': 'Tablet',
  };

  var deviceRows = deviceReport.rows();
  while (deviceRows.hasNext()) {
    var row = deviceRows.next();
    var deviceName = deviceMap[row['Device']] || row['Device'];
    var impressions = parseFloat(row['Impressions']);
    var clicks = parseFloat(row['Clicks']);
    var cost = parseFloat(row['Cost']);
    var conversions = parseFloat(row['Conversions']);
    var ctr = impressions > 0 ? (clicks / impressions) * 100 : 0;
    var costPerConversion = conversions > 0 ? cost / conversions : 0;

    deviceCsvData.push([row['CampaignName'], deviceName, impressions, clicks, ctr.toFixed(2), cost.toFixed(2), conversions.toFixed(0), costPerConversion.toFixed(2)].join(','));
  }

  // GENDER REPORT

  var genderReport = AdsApp.report('SELECT CampaignName, AdGroupName, Criteria, Impressions, Clicks, Cost, Conversions ' + 'FROM GENDER_PERFORMANCE_REPORT ' + "WHERE Impressions > 0 AND CampaignStatus = 'ENABLED'" + 'DURING ' + startDate.replace(/-/g, '') + ',' + endDate.replace(/-/g, ''));

  var genderMap = {
    MALE: 'Man',
    FEMALE: 'Vrouw',
    UNDETERMINED: 'Onbekend',
  };

  var campaignGenderTotals = {};

  var genderRows = genderReport.rows();
  while (genderRows.hasNext()) {
    var row = genderRows.next();

    var campaignName = row['CampaignName'];
    var genderName = genderMap[row['Criteria']] || row['Criteria'];
    var impressions = parseFloat(row['Impressions']);
    var clicks = parseFloat(row['Clicks']);
    var cost = parseFloat(row['Cost']);
    var conversions = parseFloat(row['Conversions']);
    var ctr = impressions > 0 ? (clicks / impressions) * 100 : 0;
    var costPerConversion = conversions > 0 ? cost / conversions : 0;

    if (!campaignGenderTotals[campaignName]) {
      campaignGenderTotals[campaignName] = {};
    }
    if (!campaignGenderTotals[campaignName][genderName]) {
      campaignGenderTotals[campaignName][genderName] = { impressions: 0, clicks: 0, cost: 0, conversions: 0 };
    }

    var genderTotal = campaignGenderTotals[campaignName][genderName];
    genderTotal.impressions += impressions;
    genderTotal.clicks += clicks;
    genderTotal.cost += cost;
    genderTotal.conversions += conversions;

    genderCsvData.push([campaignName, row['AdGroupName'], genderName, impressions, clicks, ctr.toFixed(2), cost.toFixed(2), conversions.toFixed(0), costPerConversion.toFixed(2)].join(','));
  }

  for (var campaign in campaignGenderTotals) {
    for (var gender in campaignGenderTotals[campaign]) {
      var totals = campaignGenderTotals[campaign][gender];
      var avgCtr = totals.impressions > 0 ? (totals.clicks / totals.impressions) * 100 : 0;
      var avgCpc = totals.clicks > 0 ? totals.cost / totals.clicks : 0;
      var avgCostPerConversion = totals.conversions > 0 ? totals.cost / totals.conversions : 0;

      genderSummaryCsvData.push([campaign, gender, totals.impressions.toFixed(0), totals.clicks.toFixed(0), totals.cost.toFixed(2), totals.conversions.toFixed(0), avgCtr.toFixed(2), avgCpc.toFixed(2), avgCostPerConversion.toFixed(2)].join(','));
    }
  }

  // DAY REPORT

  var dailyReport = AdsApp.report('SELECT CampaignName, DayOfWeek, Impressions, Clicks, Cost, Conversions ' + 'FROM CAMPAIGN_PERFORMANCE_REPORT ' + "WHERE Impressions > 0 AND CampaignStatus = 'ENABLED'" + 'DURING ' + startDate.replace(/-/g, '') + ',' + endDate.replace(/-/g, ''));

  var weekdayData = {};
  var dailyRows = dailyReport.rows();

  while (dailyRows.hasNext()) {
    var row = dailyRows.next();

    var campaignName = row['CampaignName'];
    var dayOfWeek = row['DayOfWeek'];
    var impressions = parseFloat(row['Impressions']);
    var clicks = parseFloat(row['Clicks']);
    var cost = parseFloat(row['Cost']);
    var conversions = parseFloat(row['Conversions']);

    if (!weekdayData[campaignName]) {
      weekdayData[campaignName] = {};
    }

    if (!weekdayData[campaignName][dayOfWeek]) {
      weekdayData[campaignName][dayOfWeek] = {
        impressions: 0,
        clicks: 0,
        cost: 0,
        conversions: 0,
      };
    }

    weekdayData[campaignName][dayOfWeek].impressions += impressions;
    weekdayData[campaignName][dayOfWeek].clicks += clicks;
    weekdayData[campaignName][dayOfWeek].cost += cost;
    weekdayData[campaignName][dayOfWeek].conversions += conversions;
  }

  for (var campaign in weekdayData) {
    for (var day in weekdayData[campaign]) {
      var data = weekdayData[campaign][day];
      var ctr = data.impressions > 0 ? (data.clicks / data.impressions) * 100 : 0;
      var costPerConversion = data.conversions > 0 ? data.cost / data.conversions : 0;

      dayCsvData.push([campaign, day, data.impressions.toFixed(0), data.clicks.toFixed(0), ctr.toFixed(2), data.cost.toFixed(2), data.conversions.toFixed(0), costPerConversion.toFixed(2)].join(','));
    }
  }

  // SUMMARY REPORT
  var campaignIterator = AdsApp.campaigns().withCondition('Status = ENABLED').get();
  var activeCampaigns = 0;
  while (campaignIterator.hasNext()) {
    campaignIterator.next();
    activeCampaigns++;
  }

  var averageCpc = totalClicks > 0 ? totalCost / totalClicks : 0;
  var averageCtr = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;
  var averageCostPerConversion = totalConversions > 0 ? totalCost / totalConversions : 0;
  summaryCsvData.push([activeCampaigns, totalClicks.toFixed(2), totalImpressions.toFixed(2), totalCost.toFixed(2), totalConversions.toFixed(0), averageCtr.toFixed(2), averageCpc.toFixed(2), averageCostPerConversion.toFixed(2)].join(','));

  // EMAIL PREPARATION

  var ageRangeFile = Utilities.newBlob(ageRangeCsvData.join('\n'), 'text/csv', 'report_age_range_adgroup.csv');
  var ageRangeSummaryFile = Utilities.newBlob(ageRangeSummaryCsvData.join('\n'), 'text/csv', 'report_age_range_campaign.csv');
  var deviceFile = Utilities.newBlob(deviceCsvData.join('\n'), 'text/csv', 'report_device.csv');
  var genderFile = Utilities.newBlob(genderCsvData.join('\n'), 'text/csv', 'report_gender_adgroup.csv');
  var genderSummaryFile = Utilities.newBlob(genderSummaryCsvData.join('\n'), 'text/csv', 'report_gender_campaign.csv');
  var dailyFile = Utilities.newBlob(dayCsvData.join('\n'), 'text/csv', 'report_day.csv');
  var summaryFile = Utilities.newBlob(summaryCsvData.join('\n'), 'text/csv', 'report_summary.csv');

  var zip = Utilities.zip([ageRangeFile, ageRangeSummaryFile, deviceFile, genderFile, genderSummaryFile, dailyFile, summaryFile], 'reports.zip');

  MailApp.sendEmail({
    to: emailRecipient,
    subject: 'Performance Reports',
    body: 'Please find the attached ZIP file containing CSV reports for age range, device, gender, daily performance, and total performance.',
    attachments: [zip],
  });

  Logger.log('ZIP file sent to: ' + emailRecipient);
}

function getDayOfWeek(dateString) {
  var date = new Date(dateString);
  var days = ['Zondag', 'Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag', 'Zaterdag'];
  return days[date.getDay()];
}
