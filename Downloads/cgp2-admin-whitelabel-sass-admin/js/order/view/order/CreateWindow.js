/**
 * @author xiu
 * @date 2023/12/8
 */
Ext.define('CGP.order.view.order.CreateWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.createWindow',
    title: i18n.getKey('window'),
    margin: 0,
    layout: 'fit',
    formConfig: null,
    bbarConfig: null,
    modal: true,
    constrain: true,
    autoScroll: true,
    initComponent: function () {
        var me = this;
        me.items = [
            Ext.Object.merge({
                xtype: 'errorstrickform',
                itemId: 'form',
                defaults: {
                    margin: '10 25 5 25',
                    width: 350,
                    allowBlank: false,
                },
                items: []
            }, me.formConfig)
        ];
        me.bbar = Ext.Object.merge({
            xtype: 'bottomtoolbar',
            saveBtnCfg: {
                text: i18n.getKey('submit'),
                handler: function (btn) {
                    var me = btn.ownerCt.ownerCt,
                        form = me.getComponent('form'),
                        formValue = form.getValues();

                    if (form.isValid()) {
                        console.log(formValue);
                    }
                }
            }
        },me.bbarConfig);
        me.callParent();
    },
    getValue: function () {
        var me = this,
            form = me.getComponent('form');

        return form.getValue();
    },
    setValue: function (data) {
        var me = this,
            form = me.getComponent('form');

        return form.setValue(data);
    },
    isValid: function (comp) {
        var items = comp.items.items;
        return items.every(item => {
            return item.isValid() === true;
        })
    },
})