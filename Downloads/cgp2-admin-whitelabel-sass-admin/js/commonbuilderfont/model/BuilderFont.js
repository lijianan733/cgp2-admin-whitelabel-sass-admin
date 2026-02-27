
Ext.define("CGP.commonbuilderfont.model.BuilderFont",{
    extend : 'Ext.data.Model',
    idProperty: '_id',
    fields: [{
        name: '_id',
        type: 'string'
    }, {
        name: 'fontFamily',
        type: 'string'
    },{
        name: 'displayName',
        type: 'string'
    },{
        name: 'wordRegExp',
        type: 'string'
    },{
        name: 'fontStyleKeys',
        type: 'array',
        serialize: function (value) {
            if(Ext.isEmpty(value)){
                return [];
            }
            return value;
        }
    },{
        name: 'languages',
        type: 'array',
        serialize: function (value) {
            if(Ext.isEmpty(value)){
                return [];
            }
            return value;
        }
    },{
        name: 'clazz',
        type: 'string',
        defaultValue: 'com.qpp.cgp.domain.common.font.Font'
    }],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/font',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});
