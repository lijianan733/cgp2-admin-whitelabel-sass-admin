Ext.define("CGP.material.view.information.views.AddConstraint",{
    extend : 'Ext.window.Window',
    record : null,//一个option选项
    controller : null,//MainController
    modal : true,
    closeAction: 'hidden',
    resizable : false,
    width: 450,
    height: 180,
    buttonAlign : 'left',
    layout: 'fit',
    bodyStyle: {
        padding: '10px',
        paddingTop : '20px'
    },
    initComponent : function(){
        var me = this;
        if(me.createOrEdit == 'edit'){
            me.title = i18n.getKey('edit');
        }else {
            me.title = i18n.getKey('create');
        }
        var quantity ={
            xtype : 'numberfield',
            fieldLabel : i18n.getKey('quantity'),
            allowBlank : false,
            labelWidth : 120,
            name: 'quantity',
            itemId: 'quantity',
            minValue:0,
            value : me.record.get("quantity")
        };
        var total = {
            xtype : 'numberfield',
            fieldLabel : i18n.getKey('total'),
            allowBlank : false,
            labelWidth : 120,
            name: 'total',
            itemId: 'total',
            minValue:0,
            value : me.record.get("total")
        };
        var numerator = {
            xtype : 'numberfield',
            fieldLabel : i18n.getKey('numerator'),
            allowBlank : false,
            labelWidth : 120,
            name: 'numerator',
            itemId: 'numerator',
            minValue:0,
            value : me.record.get("numerator")
        };
        var denominator = {
            xtype : 'numberfield',
            fieldLabel : i18n.getKey('denominator'),
            allowBlank : false,
            labelWidth : 120,
            name: 'denominator',
            itemId: 'denominator',
            minValue:0,
            value : me.record.get("denominator")
        };
        var predefineQuantity = {
            xtype : 'numberfield',
            fieldLabel : i18n.getKey('predefineQuantity'),
            allowBlank : false,
            labelWidth : 120,
            minValue:0,
            name: 'predefineQuantity',
            itemId: 'predefineQuantity',
            value : me.record.get("predefineQuantity")
        };
        var step = {
            xtype : 'numberfield',
            fieldLabel : i18n.getKey('step'),
            allowBlank : false,
            labelWidth : 120,
            name: 'step',
            itemId: 'step',
            minValue:0,
            minValue:0,
            value : me.record.get("step")
        };
        var expression = {
            xtype : 'textarea',
            fieldLabel : i18n.getKey('expression'),
            allowBlank : false,
            labelWidth : 120,
            name: 'expression',
            itemId: 'expression',
            value : me.record.get("expression")
        };
        me.items = [{
            xtype: 'form',
            border: false,
            items:[],
            defaults: {
              width: 350
            },
            listeners: {
                afterrender: function(comp){
                    if(me.clazz == 'com.qpp.cgp.domain.bom.constraint.RangeQuantityConstraint'){
                        comp.add(predefineQuantity,step);
                    }else if(me.clazz == 'com.qpp.cgp.domain.bom.constraint.FillQuantityConstraint'){
                        comp.add(total);
                    }else if(me.clazz == 'com.qpp.cgp.domain.bom.constraint.FixedQuantityConstraint'){
                        comp.add(quantity);
                    }else if(me.clazz == 'com.qpp.cgp.domain.bom.constraint.InsertRatioConstraint'){
                        comp.add(numerator,denominator);
                    }else if(me.clazz == 'com.qpp.cgp.domain.bom.constraint.CalculatedQuantityConstraint'){
                        comp.add(expression)
                    }
                }
            }
        }];
        me.buttons = ['->',{
            text : i18n.getKey('ok'),
            itemId : 'okBtn',
            handler : function(btn){
                if(me.form.isValid()){
                    var data = me.form.getValues();
                    data.clazz = me.clazz;
                    var store = me.grid.getStore();
                    if(me.createOrEdit == 'create'){
                        var record = Ext.create('CGP.material.model.Constraint',data);
                        store.insert(1,record);
                    }else{
                        Ext.Object.each(data,function(key,value){
                            me.record.set(key,value);
                        });
                    }
                    if(me.win){
                        me.win.close();
                    }
                    me.close();
                }
            }
        },{
            text : i18n.getKey('cancel'),
            handler : function(btn){
                me.close();
            }
        }];
        me.callParent(arguments);
        me.form = me.down('form');
    }
});