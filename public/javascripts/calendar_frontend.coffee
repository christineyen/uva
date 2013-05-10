###
# Contains front-end logic
###

window.UVA = {}

UVA.cal = (->
  showPreviousByMonthDiv = (a, containerDivName) ->
    $monthContainer = $(containerDivName + ' .monthContainer:visible').first()
    $prevMonth = $monthContainer.prev('.monthContainer')
    $prevMonth.show()
    if ($('.monthContainer:hidden').length == 0)
      $(a).hide()

  showPrevious = ->
    showPreviousByMonthDiv(this, '.content')
    showPreviousByMonthDiv(this, '.sidebar')
    return false

  init = ->
    $('.label.success').twipsy(
      placement : 'below'
      live      : true
      html      : true
    )
    $('#showPreviousMonth').click(showPrevious)
  (
    init: init
  )
)()
