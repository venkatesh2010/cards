(function ($) {
	$(function () {
		cardCanvas = {};
		cardCanvas.groupCards = function () {
			var cards = [];
			cards[0] = $("[name^='spade']").sort(cardCanvas.sortCards);
			cards[1] = $("[name^='dmd']").sort(cardCanvas.sortCards);
			cards[2] = $("[name^='club']").sort(cardCanvas.sortCards);
			cards[3] = $("[name^='heart']").sort(cardCanvas.sortCards);
			var boxes = $('.card-holder .col');
			boxes.empty();
			cards.map(function (a, i) {
				var el = ''
				//join the html of all the images in the specific group
				cards[i].map(function (i, a) { el += a.outerHTML });
				if (boxes[i] == undefined) {
					var cardbox = '<div class="col card"></div>';
					$('.card-holder').append(cardbox);
					boxes = $('.card-holder .col');
				}
				boxes[i].innerHTML = el;
			})
			cardCanvas.manageEmptyBoxes();

		};
		
		cardCanvas.sortCards = function (a, b) {
			return $(a).attr('name') > $(b).attr('name');
		};

		cardCanvas.startDrag = function (e) {
			cardCanvas.currentDragCard = e.target;
			cardCanvas.doNotRemove = true;
		};

		cardCanvas.manageEmptyBoxes = function () {
			var boxArray = $('.card-holder .col');
			boxArray.addBox = false;
			boxArray.map(function (i, a) {
				if ($(a).find('img').length == 0) {
					a.remove();
					boxArray.addBox = true;
				}
			});
			if (boxArray.length < 7 || boxArray.addBox) {
				var cardbox = '<div class="col card"></div>';
				$('.card-holder').append(cardbox);
			};
		}

		cardCanvas.endDrag = function (e) {
			e.preventDefault();
			var cardID = e.target.id;
			if (cardCanvas.doNotRemove == false) {
				cardCanvas.adjustCardPosition(e);
				cardCanvas.currentDragCard.remove();
				cardCanvas.manageEmptyBoxes();
			}
			if (cardCanvas.droppedOnSameGroup) {
				cardCanvas.adjustCardPosition(e);
				cardCanvas.droppedOnSameGroup = false;
			}
			cardCanvas.currentDragCard = null;
		};

		cardCanvas.dropCard = function (e) {
			e.preventDefault();
			cardCanvas.droppedBox = e.currentTarget;
			if ($(e.currentTarget).find('#' + cardCanvas.currentDragCard.id).length == 0) {
				//enter if card does not belong to the same group
				e.currentTarget.innerHTML += cardCanvas.currentDragCard.outerHTML;
				cardCanvas.doNotRemove = false;
			} else {
				cardCanvas.doNotRemove = true;
				cardCanvas.droppedOnSameGroup = true;
			}
		};

		preventDefault = function (e) {
			e.preventDefault();
		};
		cardCanvas.adjustCardPosition = function (e) {
			var droppedBox = $(cardCanvas.droppedBox);
			var leftLimit = droppedBox.offset().left;
			var targetId = e.target.id;
			var htmlString = '';
			var adjusted = false;
			var children = droppedBox.children();
			for (var i = 0; i < children.length; i++) {
				var child = children[i];
				if (child.id != targetId) {
					var childLeft = $(child).offset().left;
					if (childLeft > e.originalEvent.screenX && leftLimit < e.originalEvent.screenX) {
						htmlString += e.target.outerHTML + child.outerHTML;
						adjusted = true;
						leftLimit = childLeft;
					} else {
						htmlString += child.outerHTML;
					}
				}
			}
			if (!adjusted) {
				htmlString += e.target.outerHTML;
			}
			droppedBox[0].innerHTML = htmlString;
		};
		$('.card-holder').on('dragstart', 'img', cardCanvas.startDrag);
		$('.card-holder').on('dragend', 'img', cardCanvas.endDrag);
		$('.card-holder').on('drop', '.col', cardCanvas.dropCard);
		$('.card-holder').on('dragenter dragover', '.col', preventDefault);

	}); // end of document ready
})(jQuery); // end of jQuery name space