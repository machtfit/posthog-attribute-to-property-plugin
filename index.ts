const prefix = "data-ph-capture-attribute-";

// Learn more about plugins at: https://posthog.com/docs/plugins/build/overview
function getMatchingAttributes(o, prefix) {
    return Object.keys(o).filter((k) =>
        k.toString().startsWith(`attr__${prefix}`)
    )
}

function convertDataAttribute(input: string): string {
  //  the 6 extra chars are dure to the additional prefix "attr__"
  const withoutDataPrefix = input.startsWith("attr__"+prefix) ? input.slice(prefix.length + 6) : input;

  // Convert from kebab-case to snake_case
  const snakeCase = withoutDataPrefix.replace(/-/g, "_");

  return snakeCase;
}

// Processes each event, optionally transforming it
export function processEvent(event, _) {
    // only process autocapture events
    if (
        event.event == "$autocapture" &&
        event.properties.hasOwnProperty("$elements")
    ) {
        // for each element, find all matching attributes
        event.properties["$elements"].forEach(function (element, i) {
            getMatchingAttributes(element, prefix).forEach(function (
                key,
                i
            ) {
                // add attribute without attr__ prefix to event
                event.properties[convertDataAttribute(key)] = element[key]
            })
        })
    }
    // Return the event to be ingested, or return null to discard
    return event
}
