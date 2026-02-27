Ext.Loader.syncRequire([
    'CGP.product.view.productconfig.productdesignconfig.view.preprocessconfig.view.simplifytype.MVTCombo',
    'CGP.product.view.productconfig.productdesignconfig.view.preprocessconfig.view.simplifytype.SelectorMappingSet',
    'CGP.common.expressionfield.ExpTextField'
])
Ext.define('CGP.product.view.productconfig.productdesignconfig.view.preprocessconfig.view.simplifytype.SelectorMappingEdit', {
    extend: 'Ext.ux.form.ErrorStrickForm',
    // alias: 'widget.calenderdetailconfigform',
    designId: null,
    isValidForItems: true,
    autoScroll: true,
    border: false,
    layout: {
        type: 'vbox',
    },
    defaults: {
        allowBlank: true,
        msgTarget: 'side',
        width: 500,
        margin: '5 25 5 25'
    },
    record:null,
    leftData:null,
    rightData:null,
    initComponent: function () {
        var me = this,rightObjData=[];
        me.designId = parseInt(JSGetQueryString('designId') ?? 0);
        var pmvtStore = Ext.data.StoreManager.lookup('pmvtStore');
        var smvtStore = Ext.data.StoreManager.lookup('smvtStore');
        if(me.rightData?.length>0){
            for(var i=0;i<me.rightData.length;i++){
                var item=me.rightData[i];
                var pmvtRecd=pmvtStore.findRecord('_id',item._id);
                if(pmvtRecd){
                    rightObjData.push(pmvtRecd.data);
                    continue;
                }
                var smvtRecd=smvtStore.findRecord('_id',item._id);
                if(smvtRecd){
                    rightObjData.push(smvtRecd.data);
                }
            }
        }
        var leftStore=Ext.create('Ext.data.Store',{
            fields: [
                {name: '_id', type: 'number'},
                {name: 'name',  type: 'string'},
                {name: 'displayName', type: 'string'},
                {name: 'clazz',  type: 'string'}
            ],
            data:me.leftData,
            proxy: {
                type: 'pagingmemory'
            }
        });
        var rightStore=Ext.create('Ext.data.Store',{
            fields: [
                {name: '_id', type: 'number'},
                {name: 'name',  type: 'string',defaultValue:''},
                {name: 'displayName', type: 'string',defaultValue:''},
                {name: 'clazz',  type: 'string'}
            ],
            data:rightObjData,
            proxy: {
                type: 'pagingmemory'
            }
        });
        me.items = [
            {
                name: 'left',
                xtype: 'combo',
                fieldLabel: i18n.getKey('leftMVT'),
                itemId: 'left',
                allowBlank: false,
                store: leftStore,
                valueField: '_id',
                displayField: 'displayName',
                editable: false,
            },
            {
                name: 'right',
                xtype: 'combo',
                fieldLabel: i18n.getKey('rightMVT'),
                itemId: 'right',
                allowBlank: false,
                store: rightStore,
                valueField: '_id',
                displayField: 'displayName',
                editable: false,
            },
            {
                name: 'leftSelector',
                xtype: 'exptext',
                allowBlank: false,
                fieldLabel: i18n.getKey('leftSelector'),
                itemId: 'leftSelector'
            },
            {
                name: 'rightSelector',
                xtype: 'exptext',
                fieldLabel: i18n.getKey('rightSelector'),
                allowBlank: false,
                itemId: 'rightSelector'
            }
        ];
        me.callParent();
        me.on(
            'afterrender', function (comp) {
                if(comp.record){
                    comp.setValue(comp.record.data);
                }
            }
        );
    },
    getValue: function () {
        var me = this;
        var items = me.items.items, result = {};
        var controller = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.preprocessconfig.controller.Controller');

        if (me.rendered == true) {
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                if (item.xtype=='combo') {
                    var recd=item.store.findRecord('_id',item.getValue())
                    result[item.name] =recd?.data ;
                } else {
                    result[item.name] = controller.assembleValueExp(item.getValue());
                }
            }
            return result;
        } else {
            return me.rawData;
        }
    },
    setValue: function (data) {
        var me = this;
        var controller = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.preprocessconfig.controller.Controller');
        me.rawData = Ext.clone(data);
        var items = me.items.items;
        if (me.rendered == true) {
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                if (item.xtype=='combo') {
                    item.setValue(data[item.name]?._id);
                } else {
                    var selectorStr = data[item.name]?.expression;
                    item.setValue(controller.extractValue(selectorStr));
                }
            }
        } else {
            me.on('afterrender', function () {
                me.setValue(me.rawData);
            })
        }
    }
})
