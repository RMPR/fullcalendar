import { getTimeTexts } from './TimeGridEventRenderUtils'

describe('the time text on events', function() {

  describe('in agendaWeek', function() {
    pushOptions({
      defaultView: 'agendaWeek',
      defaultDate: '2017-07-03',
      scrollTime: '00:00'
    })

    it('renders segs with correct local timezone', function() {
      var FORMAT = { hour: 'numeric', minute: '2-digit', timeZoneName: 'short' }

      initCalendar({
        timeZone: 'local',
        eventTimeFormat: FORMAT,
        events: [
          { start: '2017-07-03T23:00:00', end: '2017-07-04T13:00:00' }
        ]
      })

      expect(
        getTimeTexts()
      ).toEqual([
        currentCalendar.formatRange(
          new Date('2017-07-03T23:00:00'),
          new Date('2017-07-04T00:00:00'),
          FORMAT
        ),
        currentCalendar.formatRange(
          new Date('2017-07-04T00:00:00'),
          new Date('2017-07-04T13:00:00'),
          FORMAT
        )
      ])
    })
  })

})
