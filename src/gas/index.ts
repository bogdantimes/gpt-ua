import TextOutput = GoogleAppsScript.Content.TextOutput;
import HtmlOutput = GoogleAppsScript.HTML.HtmlOutput;
import DoGet = GoogleAppsScript.Events.DoGet;
import DoPost = GoogleAppsScript.Events.DoPost;

const EN = "en";

function doGet(): HtmlOutput {
  return HtmlService.createHtmlOutput().setTitle(`Not found`);
}

function askGPT3(prompt: string): { cost: number; answer: string } {
  const serviceURL =
    PropertiesService.getScriptProperties().getProperty("serviceURL");

  if (!serviceURL) {
    return { cost: 0, answer: "Service is not available" };
  }

  // prompt should go after ?
  const url = `${serviceURL}?${prompt}`;
  const response = UrlFetchApp.fetch(url, {
    muteHttpExceptions: true,
  });
  const responseText = response.getContentText();
  console.log(responseText);
  if (response.getResponseCode() !== 200) {
    return { cost: 0, answer: `Service error: ${response.getContentText()}` };
  }
  const result = JSON.parse(responseText);
  const totalTokens = result?.usage.total_tokens || 0;
  const cost: number = (totalTokens / 1000) * 0.02;
  const answer = result?.choices[0]?.text;
  return { answer, cost };
}

function doPost(request: DoPost): TextOutput {
  // request contains `lang` and `prompt` in the body
  console.log(JSON.stringify(request));

  let store = PropertiesService.getScriptProperties();
  let curMoney = +(store.getProperty("moneyLeft") || 0);

  if (curMoney <= 0) {
    return ContentService.createTextOutput(
      JSON.stringify({ error: "No money left", moneyLeft: curMoney })
    ).setMimeType(ContentService.MimeType.JSON);
  }

  let { lang = "ru", prompt } = JSON.parse(request.postData?.contents) || {};

  if (!prompt) {
    return ContentService.createTextOutput(
      JSON.stringify({ answer: "", moneyLeft: curMoney, usageCost: 0 })
    ).setMimeType(ContentService.MimeType.JSON);
  }

  if (lang != EN) {
    // Translate to English
    prompt = LanguageApp.translate(prompt, lang, EN);
  }
  const { answer: orig, cost } = askGPT3(prompt);

  // Get current tracked cost and add the new cost
  // Reduce moneyLeft
  let { usageCost = 0, moneyLeft } = store.getProperties();
  usageCost = String(+usageCost + cost);
  moneyLeft = String(+moneyLeft - cost);
  store.setProperties({ usageCost, moneyLeft });

  // Translate back to the original language
  const answer = lang == EN ? orig : LanguageApp.translate(orig, EN, lang);

  return ContentService.createTextOutput(
    JSON.stringify({ answer, orig, usageCost, moneyLeft })
  ).setMimeType(ContentService.MimeType.JSON);
}

global.doGet = doGet;
global.doPost = doPost;
