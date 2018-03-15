class Validate{
    constructor(form_name){
        this.form = form_name;
    }

    init(){

        let self = this;

        if ( !this.form ) return console.error('Form tag not found');

        this.form_inputs = [].slice.call(this.form.elements);
        this.inputs_required = this.form_inputs.filter( input => input.hasAttribute('data-required') );
        this.form_valid_toggle = false;

        this.validate_inputs();
    }

    validate_inputs(){
        this.form_valid_toggle = this.inputs_required.every( input => {
            let reqExp = new RegExp(input.dataset.required, 'g');
            let value = input.value;

            userInfo[input.name] = value;

            return reqExp.test(value);
        } );

        if ( !this.form_valid_toggle ){
            enterModal.show_error('Incorrect email or password');
        }

        return this.form_valid_toggle;

    }
}