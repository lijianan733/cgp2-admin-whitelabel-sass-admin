Ext.define('CGP.common.expressionfield.ExpNumberField', {
    extend: 'Ext.form.field.Number',
    alias: 'widget.expnumber',
    constructor: function (config) {
        var me = this;
        me.initConfig(config);
        me.callParent([config]);
    },
    diyGetValue:function (){
        var me = this;
        var itemValue = {
            "clazz": "com.qpp.cgp.expression.Expression",
            "resultType": "String",
            "expressionEngine": "JavaScript",
            "inputs": [],
            "expression": "",
            "multilingualKey": "com.qpp.cgp.expression.Expression"
        };
        itemValue.expression = Ext.String.format('function expression(args){return {0};}', me.getValue());
        return itemValue;
    },
    diySetValue:function (data){
        var me = this;
        if(data){
            var expStr = data?.expression;
            me.setValue(expStr.substring(expStr.search(/return /)+7,expStr.lastIndexOf(';}')));
        }
        else {
            me.setValue(NaN);
        }
    }

})