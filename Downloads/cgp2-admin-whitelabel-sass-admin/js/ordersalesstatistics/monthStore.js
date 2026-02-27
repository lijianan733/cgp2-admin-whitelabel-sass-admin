var year = 2015;
var yearstr = '' ;
for(var i = 0;i < 50;i++ ){
	var n = year + i ;
		yearstr = yearstr +'{year :"'+n+'"　}';
	if(i != 50-1 ){
		yearstr = yearstr + ",";
	}
}
yearstr = "("+ "["+yearstr+"]"+")";
var data = eval(yearstr);


		
		
 Ext.create('Ext.data.Store', {
	storeId : 'yearStore',
    fields: ['year'],
    data : data
});

  Ext.create('Ext.data.Store',{
	storeId : 'monthStore',
	fields: ['month','value'],
	data : [
		{'month' : 'Jan','value' : '01'},
		{'month' : 'Feb','value' : '02'},
		{'month' : 'Mar','value' : '03'},
		{'month' : 'Apr','value' : '04'},
		{'month' : 'May','value' : '05'},
		{'month' : 'June','value' : '06'},
		{'month' : 'July','value' : '07'},
		{'month' : 'Aug','value' : '08'},
		{'month' : 'Sept','value' : '09'},
		{'month' : 'Oct','value' : '10'},
		{'month' : 'Nov','value' : '11'},
		{'month' : 'Dec','value' : '12'}
	]
});

//Ext.create('Ext.form.ComboBox', {
//    fieldLabel: 'Choose State',
//    store: states,
//    queryMode: 'local',
//    displayField: 'year',
//    valueField: 'year',
//    renderTo: Ext.getBody()
//})