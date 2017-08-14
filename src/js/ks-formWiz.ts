/*******************************************************
 * Copyright (C) 2017 KreolSoft
 *
 * formWiz project - v0.2.1
 *
 * Licensed under MIT (https://github.com/KreolSoft/formWiz/blob/master/LICENSE)
 *******************************************************/


declare var jQuery:any;


class formWiz {
	public form:any = null;
	public enabled:boolean = true;
	private $fields:Object = {};


	public constructor($formSelector) {
		this.form = jQuery($formSelector);

		this.form.find('[data-formwiz-input]').each(($i, $child) => {
			$child = jQuery($child);

			var $name = $child.data('formwiz-input') || $child.prop('name');

			this.addField($name, $child);
		});

		return this;
	}

	public addField($name, $element) {
		this.$fields[$name] = {
			element: $element,
			value: $element.prop('type') == 'checkbox' ? $element.prop('checked') : $element.val()
		};

		Object.defineProperty(this, $name, {
			get: ():any => {
				return this.$fields[$name].value;
			},
			set: ($value) => {
				if(this.$fields[$name].value == $value)
					return;

				this.$fields[$name].value = $value;
				if(this.$fields[$name].element.prop('type') == 'checkbox') {
					this.$fields[$name].element.prop('checked', ($value ? true : false)).trigger('change').trigger('formWiz-altered');
				}
				else {
					this.$fields[$name].element.val($value).trigger('change').trigger('formWiz-altered');
				}
			}
		});

		this.watch($name);

		return this;
	}

	public watch($name, $callback = null) {
		var $element = null;
		if(this.$fields[$name]) {
			$element = this.$fields[$name].element;
		}
		else {
			$element = jQuery($name);
		}

		$element
			.off('keyup.formWiz change.formWiz')
			.on('keyup.formWiz change.formWiz', ($event) => {
				var $value = null;
				if(this.$fields[$name].element.prop('type') == 'checkbox') {
					$value = this.$fields[$name].element.prop('checked');
				}
				else {
					$value = $element.val();
				}

				if(this.$fields[$name].value == $value)
					return;

				this.$fields[$name].value = $value;

				if(typeof $callback == 'function')
					$callback.call(null, this.$fields[$name].value, this.$fields[$name].element);
			})
			.on('formWiz-altered', ($event) => {
				if(typeof $callback == 'function')
					$callback.call(null, this.$fields[$name].value, this.$fields[$name].element);
			});

		return this;
	}

	public unwatch($name) {
		var $element = null;
		if(this.$fields[$name]) {
			$element = this.$fields[$name].element;
		}
		else {
			$element = jQuery($name);
		}

		$element.off('keyup.formWiz change.formWiz');

		return this;
	}

	public set submit($value) {
		jQuery(document).on('submit', this.form, ($event) => {
			$event.preventDefault();

			if(this.enabled === false)
				return;

			var $data = {};
			for(var $key in this.$fields)
				$data[$key] = this.$fields[$key].value;

			$value.call(null, $data);
		});
	}
}
