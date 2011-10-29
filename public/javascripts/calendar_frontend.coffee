###
# Contains front-end logic
###

window.UVA = {}

UVA.cal = (->
  init = ->
    $('.label.success').twipsy(
      placement : 'below'
      live      : true
      html      : true
    )
  (
    init: init
  )
)()
