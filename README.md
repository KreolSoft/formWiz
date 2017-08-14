# formWiz
A simple jQuery form observer and watcher

## Getting Started

Put a script tag into the head of your website to load formWiz:

	<script src="./dist/js/formWiz.js" type="text/javascript"></script>
	
Insert the data-binding tags into your form:

	<form id="form">
		<div class="p-wrap">
			<label class="ui-input-group">
				<div class="ui-input-label ui-input-label-clickable">Username</div>
				<input type="text" name="login" class="ui-input" data-formwiz-input />
			</label>
		</div>
		<div class="p-wrap">
			<label class="ui-input-group">
				<div class="ui-input-label ui-input-label-clickable">Password</div>
				<input type="password" name="pw" class="ui-input" **data-formwiz-input** />
			</label>
		</div>
		<div class="p-wrap submitrow">
			<button name="submit" class="ui-button">Submit</button>
		</div>
	</form>


And as the final step initiate the form wizard:

	<script>
	var $form = new formWiz('#form');				// Select the form with standard jQuery selectors
	
	$form.watch('login', function($value, $element) {		// Watch a form field, runs from the keyup- and change-event, you can only define one callback function for now
		console.log($value, $element);
		// Execute some custom code if the value changes
	});
	
	$form.submit = function() {							// Add a submit function (is run from the submit-event of the form)
		$form.enabled = false;								// Disable form submition (disables the submit-event of the form)
		// Some exciting code snippets for AJAX or what not
		if(your_defined_error) {
			$form.enabled = true;								// Enable the form submission, if something needs to be corrected in the form for resubmission
		}
	};
	</script>


## Authors

* **Nikita Nitichevski** - *Initial work* - [donnikitos](http://donnikitos.com)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* jQuery Library widely used
