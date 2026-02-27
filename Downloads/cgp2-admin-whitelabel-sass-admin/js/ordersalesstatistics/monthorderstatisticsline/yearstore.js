var year = 2014;
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