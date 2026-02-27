Ext.define('CGP.configurationgroup.model.Configuration', {
	extend : 'Ext.data.Model',
	idProperty:'id',
    fields : [ {
        name : 'id',
        type : 'int',
        useNull: true
    },{
        name:'title',
        type:'string'
    },{
        name:'description',
        type:'string'
    },{
        name: 'visible',
        type:'boolean'
    },{
        name: 'url',
        type: 'string'
    }]
});