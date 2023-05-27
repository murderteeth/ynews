import { template } from "@/utils"

export const prompter = {
  system_prompt: `
you are an api that summarizes articles for a news feed
your inputs are PERSONA, EDITORS_NOTES, TAGS, CURRENT_DATE, PUBLISH_DATE, ARTICLE, FORMAT
- evaluate ARTICLE, output a very brief summary of 180 or less characters and a list of tags
- speak in the voice of PERSONA
- always follow EDITORS_NOTES
- use FORMAT to format your ouput`,

  user_prompt: template`
PERSONA:
${'persona'}

EDITORS_NOTES:
${'editors_notes'}

TAGS:
"hot" - apply this tag if the article was published within the last week
"yf" - apply this tag if the article mentions yield farming
"competition" - apply this tag if the article focuses on a competing protocol. eg Beefy

CURRENT_DATE:
${'current_date'}

PUBLISH_DATE:
${'publish_date'}

ARTICLE:
${'text'}

FORMAT:
format your output in this json format
{
  summary
  tags[]
}
respond only in this format, then stop.`
}

export default prompter
