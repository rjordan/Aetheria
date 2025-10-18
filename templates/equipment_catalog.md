# {{name}} Equipment Guide

## Item Information
**Type:** {{type}}
{{#parent}}**Category:** {{parent}}{{/parent}}

## Description
{{description}}

{{#alternative_names}}
**Alternative Names:** {{alternative_names}}
{{/alternative_names}}

{{#damage_type}}
## Combat Properties
**Damage Type:** {{damage_type}}
{{/damage_type}}

{{#reach}}
**Reach:** {{reach}}
{{/reach}}

{{#protection}}
## Protection Values
{{#protection}}
- **{{@key}}:** {{.}}
{{/protection}}
{{/protection}}

{{#properties}}
## Special Properties
{{#properties}}
- {{.}}
{{/properties}}
{{/properties}}

{{#function}}
## Function
{{function}}
{{/function}}

{{#ammunition}}
**Ammunition:** {{ammunition}}
{{/ammunition}}

{{#slot}}
**Equipment Slot:** {{slot}}
{{/slot}}

---
*Generated from Aetheria equipment data*
