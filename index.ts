// Learn more about plugins at: https://posthog.com/docs/plugins/build/overview
function getMatchingAttributes(o, prefix) {
    return Object.keys(o).filter((k) =>
        k.toString().startsWith(`attr__${prefix}`)
    )
}
// Processes each event, optionally transforming it
export function processEvent(event, { config }) {
    // only process autocapture events
    if (
        event.event == "$autocapture" &&
        event.properties.hasOwnProperty("$elements")
    ) {
        // for each element, find all matching attributes
        event.properties["$elements"].forEach(function (element, i) {
            getMatchingAttributes(element, config.prefix).forEach(function (
                key,
                i
            ) {
                // add attribute without attr__ prefix to event
                event.properties[key.slice(6)] = element[key]
            })
        })
    }
    // Return the event to be ingested, or return null to discard
    return event
}
