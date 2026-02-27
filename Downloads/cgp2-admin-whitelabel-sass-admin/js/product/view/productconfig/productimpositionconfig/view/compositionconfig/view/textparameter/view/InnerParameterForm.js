/**
 * Created by miao on 2021/6/09.
 */
Ext.define('CGP.product.view.productconfig.productimpositionconfig.view.compositionconfig.view.textparameter.view.InnerParameterForm', {
    extend: "Ext.form.Panel",

    autoScroll: true,
    scroll: 'vertical',
    border: 0,
    width: "100%",
    padding: '20',
    layout: {
        type: 'hbox',
        align: 'stretch'
    },
    fieldDefaults: {
        margin: '0 10 0 10',
        labelWidth: 120,
        msgTarget: 'side'
    },
    initComponent: function () {
        var me = this;
        // var controller=Ext.create('');
        me.items = [
            Ext.create('CGP.product.view.productconfig.productimpositionconfig.view.compositionconfig.view.textparameter.view.ParameterGrid', {
                itemId: 'parameterGrid',
                fieldLabel: i18n.getKey('parameterGrid'),
                labelAlign: 'top',
                allowBlank:false,
                width: 350,
                listeners: {
                    select: function (row, record, index) {
                        var valueGrid = Ext.getCmp('valueGrid');
                        valueGrid.reflashData(record, index);
                    },
                    // deselect:function (row,record,index){
                    //     var valueData=me.getComponent('valueGrid').getSubmitValue();
                    //     var recordData=record.data;
                    //     recordData['valueMappings']=valueData;
                    //     Ext.Array.splice(me.getComponent('parameterGrid').getGrid().store.proxy.data, index, 1, recordData);
                    //     var testStore=me.getComponent('parameterGrid').getSubmitValue();
                    // }
                }
            }),
            Ext.create('CGP.product.view.productconfig.productimpositionconfig.view.compositionconfig.view.textparameter.view.ValueGrid', {
                id: 'valueGrid',
                fieldLabel: i18n.getKey('valueGrid'),
                labelAlign: 'top',
                flex: 1,
            }),
        ];
        me.callParent();
    },
    isValid: function () {
        var me = this;
        var isValid = true;
        var item = me.items.items[0];
        if (item.rendered && !item.allowBlank && item.isValid() == false) {
            isValid = false;
        }
        var innerParameters=item.getSubmitValue(),errors={};
        innerParameters.forEach(function (arrEl){
            if(Ext.isEmpty(arrEl['valueMappings'])){
                item.setActiveError(arrEl.name+'.valueMappings:Nulls are not allowed! ');
                isValid=false;
            }
        });
        return isValid;
    },
    getValue: function () {
        var me = this, data = [];
        data = me.getComponent('parameterGrid').getSubmitValue();
        return data;
    },
    setValue: function (data) {
        var me = this;
        me.getComponent('parameterGrid').setSubmitValue(data);
    }
})
