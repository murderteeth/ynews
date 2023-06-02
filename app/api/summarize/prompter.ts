import { template } from "@/utils"

export const prompter = {
  system_prompt: `
summarize SOURCE_DATA for a news feed as a headline

- evaluate SOURCE_DATA, output a very brief headline of 180 or less characters and a list of tags
- use FORMAT to format your ouput`,

  user_prompt: template`

TAGS:
apply tags if the headline is about this topic, valid tags:
- "veYFI" 
- "yCRV" 
- "yETH" 
- "Vaults v2" 
- "Vaults v3" 

PRIORITY:
apply a priority to the headline, valid priorities:
- "high" (this is a relevant news that might affect the price action of $YFI or the people using yearn, for example a new product launch or major feature update or release)
- "medium" (this is interesting news relevant somehow to yearn users or developers, like a feature update or small peripheral product launch)
- "low" (this is just a small update, like a github commit that doesn't add new features or fix critical bugs)

SOURCE_DATA:
${'text'}

FORMAT:
format your output in this json format
{
  headline
  priority
  tags[]
}
respond only in this format, then stop.`
}

export default prompter
