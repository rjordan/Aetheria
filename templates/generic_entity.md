# {{entityName}}

{{#description}}
{{description}}
{{/description}}

{{#type}}
**Type:** {{type}}
{{/type}}

## Properties

{{#properties}}
- **{{key}}:** {{value}}
{{/properties}}

{{#children}}
## Subtypes

{{#.}}
- {{.}}
{{/.}}
{{/children}}

---
*Part of {{dataType}} • Generated on {{generatedDate}}*
