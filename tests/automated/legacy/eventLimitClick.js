describe('eventLimitClick', function() { // simulate a click

  pushOptions({
    defaultDate: '2014-08-01', // important that it is the first week, so works w/ month + week views
    defaultView: 'month',
    eventLimit: 3,
    events: [
      { title: 'event1', start: '2014-07-29' },
      { title: 'event2', start: '2014-07-29' },
      { title: 'event2', start: '2014-07-29' },
      { title: 'event2', start: '2014-07-29' }
    ]
  })

  describe('when set to "popover"', function() {

    pushOptions({
      eventLimitClick: 'popover'
    })

    it('renders a popover upon click', function() {
      initCalendar()
      $('.fc-more').simulate('click')
      expect($('.fc-more-popover')).toBeVisible()
    })

    // more popover tests are done in eventLimit-popover
  })

  describe('when set to "week"', function() {

    pushOptions({
      eventLimitClick: 'week'
    })

    it('should go to basicWeek if it is one of the available views', function() {
      initCalendar({
        header: {
          left: 'prev,next today',
          center: 'title',
          right: 'month,basicWeek,basicDay'
        }
      })
      $('.fc-more').simulate('click')
      var view = currentCalendar.getView()
      expect(view.type).toBe('basicWeek')
    })

    it('should go to agendaWeek if it is one of the available views', function() {
      initCalendar({
        header: {
          left: 'prev,next today',
          center: 'title',
          right: 'month,agendaWeek,agendaDay'
        }
      })
      $('.fc-more').simulate('click')
      var view = currentCalendar.getView()
      expect(view.type).toBe('agendaWeek')
    })
  })

  describe('when set to "day"', function() {

    pushOptions({
      eventLimitClick: 'day'
    })

    it('should go to basicDay if it is one of the available views', function() {
      initCalendar({
        header: {
          left: 'prev,next today',
          center: 'title',
          right: 'month,basicWeek,basicDay'
        }
      })
      $('.fc-more').simulate('click')
      var view = currentCalendar.getView()
      expect(view.type).toBe('basicDay')
    })

    it('should go to agendaDay if it is one of the available views', function() {
      initCalendar({
        header: {
          left: 'prev,next today',
          center: 'title',
          right: 'month,agendaWeek,agendaDay'
        }
      })
      $('.fc-more').simulate('click')
      var view = currentCalendar.getView()
      expect(view.type).toBe('agendaDay')
    })
  })

  it('works with an explicit view name', function() {
    initCalendar({
      eventLimitClick: 'agendaWeek',
      header: {
        left: 'prev,next today',
        center: 'title',
        right: 'month,basicWeek,basicDay'
      }
    })
    $('.fc-more').simulate('click')
    var view = currentCalendar.getView()
    expect(view.type).toBe('agendaWeek')
  })

  it('works with custom function and all the arguments are correct', function() {
    initCalendar({
      eventLimitClick: function(arg) {
        expect(typeof arg).toBe('object')
        expect(arg.date).toEqualDate('2014-07-29')
        expect(arg.dayEl.getAttribute('data-date')).toBe('2014-07-29')
        expect(arg.hiddenSegs.length).toBe(2)
        expect(arg.segs.length).toBe(4)
        expect(arg.moreEl).toHaveClass('fc-more')
        expect(typeof arg.jsEvent).toBe('object')
      }
    })
    $('.fc-more').simulate('click')
  })

  it('works with custom function, and can return a view name', function() {
    initCalendar({
      eventLimitClick: function(cellInfo, jsEvent) {
        return 'agendaDay'
      }
    })
    $('.fc-more').simulate('click')
    var view = currentCalendar.getView()
    expect(view.type).toBe('agendaDay')
  })

})
