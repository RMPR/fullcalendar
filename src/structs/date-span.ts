import { DateRange, rangesEqual, OpenDateRange } from '../datelib/date-range'
import { DateInput, DateEnv } from '../datelib/env'
import { refineProps } from '../util/misc'
import { Duration } from '../datelib/duration'
import { assignTo } from '../util/object'

/*
A data-structure for a date-range that will be visually displayed.
Contains other metadata like allDay, and anything else Components might like to store.

TODO: in future, put otherProps in own object.
*/

export interface OpenDateSpanInput {
  start?: DateInput
  end?: DateInput
  allDay?: boolean
  [otherProp: string]: any
}

export interface DateSpanInput extends OpenDateSpanInput {
  start: DateInput
  end: DateInput
}

export interface OpenDateSpan {
  range: OpenDateRange
  allDay: boolean
  [otherProp: string]: any
}

export interface DateSpan extends OpenDateSpan {
  range: DateRange
}

export interface DateSpanApi {
  start: Date
  end: Date
  allDay: boolean
  [otherProp: string]: any
}

const STANDARD_PROPS = {
  start: null,
  end: null,
  allDay: Boolean
}

export function parseDateSpan(raw: DateSpanInput, dateEnv: DateEnv, defaultDuration?: Duration): DateSpan | null {
  let span = parseOpenDateSpan(raw, dateEnv)
  let { range } = span

  if (!range.start) {
    return null
  }

  if (!range.end) {
    if (defaultDuration == null) {
      return null
    } else {
      range.end = dateEnv.add(range.start, defaultDuration)
    }
  }

  return span as DateSpan
}

/*
TODO: somehow combine with parseRange?
Will return null if the start/end props were present but parsed invalidly.
*/
export function parseOpenDateSpan(raw: OpenDateSpanInput, dateEnv: DateEnv): OpenDateSpan | null {
  let leftovers = {} as DateSpan
  let standardProps = refineProps(raw, STANDARD_PROPS, {}, leftovers)
  let startMeta = standardProps.start ? dateEnv.createMarkerMeta(standardProps.start) : null
  let endMeta = standardProps.end ? dateEnv.createMarkerMeta(standardProps.end) : null
  let allDay = standardProps.allDay

  if (allDay == null) {
    allDay = (startMeta && startMeta.isTimeUnspecified) &&
      (!endMeta || endMeta.isTimeUnspecified)
  }

  // use this leftover object as the selection object
  leftovers.range = {
    start: startMeta ? startMeta.marker : null,
    end: endMeta ? endMeta.marker : null
  }
  leftovers.allDay = allDay

  return leftovers
}

export function isDateSpansEqual(span0: DateSpan, span1: DateSpan): boolean {
  return rangesEqual(span0.range, span1.range) &&
    span0.allDay === span1.allDay &&
    isSpanPropsEqual(span0, span1)
}

// the NON-DATE-RELATED props
export function isSpanPropsEqual(span0: DateSpan, span1: DateSpan): boolean {

  if (!isSpanPropsMatching(span0, span1)) {
    return false
  }

  // are there any props that span0 has that span1 DOESN'T have?
  // both have range/allDay, so no need to special-case.
  for (let propName in span0) {
    if (!(propName in span1)) {
      return false
    }
  }

  return true
}

// does subjectSpan have all the props/values that matchSpan does?
// subjectSpan is allowed to have more
export function isSpanPropsMatching(subjectSpan: DateSpan, matchSpan: DateSpan): boolean {

  for (let propName in matchSpan) {
    if (propName !== 'range' && propName !== 'allDay') {
      if (subjectSpan[propName] !== matchSpan[propName]) {
        return false
      }
    }
  }

  return true
}

export function buildDateSpanApi(span: DateSpan, dateEnv: DateEnv): DateSpanApi {
  let props = assignTo({}, span)
  delete props.range

  props.start = dateEnv.toDate(span.range.start)
  props.end = dateEnv.toDate(span.range.end)

  props.startStr = dateEnv.formatIso(span.range.start, { omitTime: span.allDay })
  props.endStr = dateEnv.formatIso(span.range.end, { omitTime: span.allDay })

  return props
}
