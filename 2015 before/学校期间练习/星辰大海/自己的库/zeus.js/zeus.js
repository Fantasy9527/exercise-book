(function() {
	var $ = function(Element) {
		return new Z(Element)

	}
	window.$=window.Z = $;
	var Z = function(Element) {
		return this.getElement(Element)

	}

	Z.prototype.getElement = function(Element) {
		this.element = [];
		var elementList = [];
		var classElement = /^\./;
		var IdElement = /^#/;
		var tagElement = "";
		//待定
		elementList = Element.split(",");

		for (var i = 0; i < elementList.length; i++) {

			if (classElement.test(elementList[i])) {

				var className = elementList[i].replace(/\./g, "")

				this.element.push(document.getElementsByClassName(className))

			} else if (IdElement.test(elementList[i])) {

				var IdName = elementList[i].replace(/#/, "")

				this.element.push([document.getElementById(IdName)]);

			} else {

				this.element.push(document.getElementsByTagName(elementList[i]));

			}

		}
		//return this

	}
	Z.prototype.each = function(Fn) {

		for (var i = 0; i < this.element.length; i++) {
			if (this.element[i].length == 1) {

				eval("this.element[i][0]." + Fn)
			} else {
				for (var j = 0; j < this.element[i].length; j++) {
					eval("this.element[i][j]." + Fn)

				}

			}

		}

	}

	Z.prototype.hide = function() {

		this.each("style.display = 'none' ")

	}
	Z.prototype.click = function(fn) {
		this.each()
		for (var i = 0; i < this.element.length; i++) {
			if (this.element[i].length == 1) {
				if (fn) {
					this.element[i][0].onclick = fn

				}

			} else {
				for (var j = 0; j < this.element[i].length; j++) {
					if (fn) {
						this.element[i][0].onclick = fn

					}

				}

			}

		}

	}
})()

