import { LightningElement, track, api } from 'lwc';
 
export default class MultiSelectComboBox extends LightningElement {
    
    @api label;
    @api disabled = false;
    @api initialValues = [];
    @track selectedValues = [];
    @api optionData = [];
    searchString;
    message;
    showDropdown = false;
 
    connectedCallback() {
        this.optionData = JSON.parse(JSON.stringify(this.optionData));
        this.showDropdown = false;
		var values = this.initialValues ? (JSON.parse(JSON.stringify(this.initialValues))) : null;
		if(values) {
            for(var i = 0; i < this.optionData.length; i++) {
                if(values.includes(this.optionData[i].value)) {
                    this.optionData[i].selected = true;
                }
            }
        }
        this.selectedValues = values;
    }
 
    filterOptions(event) {
        this.searchString = event.target.value;
        if( this.searchString && this.searchString.length > 0 ) {
            this.message = '';
            if(this.searchString.length >= 2) {
                var flag = true;
                var options = JSON.parse(JSON.stringify(this.optionData));
                for(var i = 0; i < options.length; i++) {
                    if(options[i].label.toLowerCase().trim().startsWith(this.searchString.toLowerCase().trim())) {
                        options[i].isVisible = true;
                        flag = false;
                    } else {
                        options[i].isVisible = false;
                    }
                }
                this.optionData = options;
                if(flag) {
                    this.message = "No results found for '" + this.searchString + "'";
                }
            }
            this.showDropdown = true;
        } else {
            this.showDropdown = false;
        }
	}
 
    selectItem(event) {
        var options = JSON.parse(JSON.stringify(this.optionData));
        var values = JSON.parse(JSON.stringify(this.selectedValues));
        for(var i = 0; i < options.length; i++) {
            if(options[i].value === event.currentTarget.dataset.id) {
                if(values.includes(options[i].value)) {
                    values.splice(values.indexOf(options[i].value), 1);
                } else {
                    values.push(options[i].value);
                }
                options[i].selected = options[i].selected ? false : true;
            }
        }
        this.optionData = options;
        this.selectedValues = values;
        this.sendCustomEvent();
        this.showDropdown = false;
        this.searchString = '';
    }
 
    showOptions() {
        if(this.disabled == false) {
            this.message = '';
            this.searchString = '';
            var options = JSON.parse(JSON.stringify(this.optionData));
            for(var i = 0; i < options.length; i++) {
                options[i].isVisible = true;
            }
            if(options.length > 0) {
                this.showDropdown = true;
            }
            this.optionData = options;
        }
	}

    hideOptions(){
        this.showDropdown = false;
    }
 
    removePill(event) {
        if(!this.disabled){
            var value = event.currentTarget.name;
            var options = JSON.parse(JSON.stringify(this.optionData));
            var values = JSON.parse(JSON.stringify(this.selectedValues));
            for(var i = 0; i < options.length; i++) {
                if(options[i].value === value) {
                    options[i].selected = false;
                    values.splice(values.indexOf(options[i].value), 1);
                }
            }
            this.optionData = options;
            this.selectedValues = values;
            this.sendCustomEvent();
        }
    }

    sendCustomEvent(){
        const selectEvent = new CustomEvent('selectiondone', {
                detail: this.selectedValues
            });
        this.dispatchEvent(selectEvent);
    }
}