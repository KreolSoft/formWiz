/*******************************************************
 * Copyright (C) 2017 KreolSoft
 * 
 * formWiz project - v0.2.1
 * 
 * Licensed under MIT (https://github.com/KreolSoft/formWiz/blob/master/LICENSE)
 *******************************************************/


var formWiz = (function () {
    function formWiz($formSelector) {
        var _this = this;
        this.form = null;
        this.enabled = true;
        this.$fields = {};
        this.form = jQuery($formSelector);
        this.form.find('[data-formwiz-input]').each(function ($i, $child) {
            $child = jQuery($child);
            var $name = $child.data('formwiz-input') || $child.prop('name');
            _this.addField($name, $child);
        });
        return this;
    }
    formWiz.prototype.addField = function ($name, $element) {
        var _this = this;
        this.$fields[$name] = {
            element: $element,
            value: $element.prop('type') == 'checkbox' ? $element.prop('checked') : $element.val()
        };
        Object.defineProperty(this, $name, {
            get: function () {
                return _this.$fields[$name].value;
            },
            set: function ($value) {
                if (_this.$fields[$name].value == $value)
                    return;
                _this.$fields[$name].value = $value;
                if (_this.$fields[$name].element.prop('type') == 'checkbox') {
                    _this.$fields[$name].element.prop('checked', ($value ? true : false)).trigger('change').trigger('formWiz-altered');
                }
                else {
                    _this.$fields[$name].element.val($value).trigger('change').trigger('formWiz-altered');
                }
            }
        });
        this.watch($name);
        return this;
    };
    formWiz.prototype.watch = function ($name, $callback) {
        var _this = this;
        if ($callback === void 0) { $callback = null; }
        var $element = null;
        if (this.$fields[$name]) {
            $element = this.$fields[$name].element;
        }
        else {
            $element = jQuery($name);
        }
        $element
            .off('keyup.formWiz change.formWiz')
            .on('keyup.formWiz change.formWiz', function ($event) {
            var $value = null;
            if (_this.$fields[$name].element.prop('type') == 'checkbox') {
                $value = _this.$fields[$name].element.prop('checked');
            }
            else {
                $value = $element.val();
            }
            if (_this.$fields[$name].value == $value)
                return;
            _this.$fields[$name].value = $value;
            if (typeof $callback == 'function')
                $callback.call(null, _this.$fields[$name].value, _this.$fields[$name].element);
        })
            .on('formWiz-altered', function ($event) {
            if (typeof $callback == 'function')
                $callback.call(null, _this.$fields[$name].value, _this.$fields[$name].element);
        });
        return this;
    };
    formWiz.prototype.unwatch = function ($name) {
        var $element = null;
        if (this.$fields[$name]) {
            $element = this.$fields[$name].element;
        }
        else {
            $element = jQuery($name);
        }
        $element.off('keyup.formWiz change.formWiz');
        return this;
    };
    Object.defineProperty(formWiz.prototype, "submit", {
        set: function ($value) {
            var _this = this;
            jQuery(document).on('submit', this.form, function ($event) {
                $event.preventDefault();
                if (_this.enabled === false)
                    return;
                var $data = {};
                for (var $key in _this.$fields)
                    $data[$key] = _this.$fields[$key].value;
                $value.call(null, $data);
            });
        },
        enumerable: true,
        configurable: true
    });
    return formWiz;
}());
