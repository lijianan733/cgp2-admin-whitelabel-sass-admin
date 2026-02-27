Ext.define("CGP.builderbackground.store.TemporalFace",{
	extend  : 'Ext.data.Store',
	fields : [{
		name : "faceType",
		type : 'int'
	},{
		name : 'faceName',
		type : 'string'
	},"name","format",{
		name : 'width',
		type : 'int'
	},{
		name : 'height',
		type : 'int'
	},"originalFileName",{
		name : 'type',
		type : 'string'
	},{
		name : 'typeName',
		type : 'string'
	}],
	groupField: 'faceName',
	data : []
});