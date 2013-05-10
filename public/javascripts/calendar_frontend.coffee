###
# Contains front-end logic
###

window.UVA = {}

UVA.cal = (->
  showPrevious = ->
    $monthContainer = $('.monthContainer:visible').first()
    $prevMonth = $monthContainer.prev('.monthContainer')
    $prevMonth.show()
    if ($('.monthContainer:hidden').length == 0)
      $(this).hide()
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
