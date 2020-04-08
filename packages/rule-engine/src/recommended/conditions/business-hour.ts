import { Condition } from "../../models/rule";
import { ProductEventData } from "@freshworks-jaya/marketplace-models";
import { Utils } from '../../Utils';
import { Integrations } from '../../models/rule-engine';
import axios from 'axios';

export default async (condition: Condition, productEventData: ProductEventData, integrations: Integrations,): boolean => {
  

  const freshchatApiUrl= integrations.freshchatv1.url;
  const freshchatApiToken= integrations.freshchatv1.token;
  
  const businessHours = await axios.get(freshchatApiUrl, {
    headers: {
      Authorization: freshchatApiToken,
    },
  });
  let conditionBusinessHour = businessHours.data.filterBy('operatingHoursId', condition.value);

  // call business hour operator with conditionBusinessHour and return the same
}