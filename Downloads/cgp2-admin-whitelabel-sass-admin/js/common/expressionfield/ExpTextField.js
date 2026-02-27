Ext.define('CGP.common.expressionfield.ExpTextField', {
    extend: 'Ext.form.field.Text',
    alias: 'widget.exptext',
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
        itemValue.expression = Ext.String.format('function expression(args){return \"{0}\";}', me.getValue());
        return itemValue;
    },
    diySetValue:function (data){
        var me = this;
        if(data){
            var expStr = data?.expression;
            me.setValue(expStr.substring(expStr.search(/return /)+8,expStr.lastIndexOf('\";}')));
        }
        else {
            me.setValue('');
        }
    }
})