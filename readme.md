#Gopher
Hello there, **Gopher** is a plugin for **jQuery.Chosen**, to improve efficiency when duplicate selection.
***
##Demo
[![Click here](https://img.youtube.com/vi/LMUztamX0WY/0.jpg)](https://www.youtube.com/watch?v=LMUztamX0WY)

### Demo page
* [Chosen-Gopher](https://lulualulu.github.io/Chosen-Gopher/)

***
## How To Use the Gopher
* Include jQuery,Chosen and Gopher to your HTML. 
* Preper your source-select element :
	<select id="source_select">
    <option>there are source option </option>
	<option>a</option>
	<option>lot</option>
	<option>options</option>
    </select>

	```
	<select id="source_select">
    	<option>there are source option </option>
    </select>
	```
* Trigger **Chosen** on your source select element:
	```
	 $("#source_select").chosen(); 
	```
* Trigger **Gopher** on other child-select elements which want to be like source select :

	<select class="child-select">
    	<option> I want to be source</option>
    </select>
	<select  class="child-select">
		<option> I want to be source</option>
    </select>
	<select class="child-select">
		<option> I want to be source</option>
    </select>

	```
      $('.child-select').gopher({
        main_select: document.getElementById('source_select'),
      });
	```
* All child-select already inheritance from source-select:

	<select class="child-select">
    <option> I same as source</option>
	<option>a</option>
	<option>lot</option>
	<option>options</option>
    </select>
	<select  class="child-select">
	<option> I same as source</option>
	<option>a</option>
	<option>lot</option>
	<option>options</option>
    </select>
	<select class="child-select">
	<option> I same as source</option>
	<option>a</option>
	<option>lot</option>
	<option>options</option>
    </select>

***
##Support
* jQuery 1.7+
* Chosen 1.85+


****

##Reference
* Chosen [harvesthq/chosen](https://github.com/harvesthq/chosen)
