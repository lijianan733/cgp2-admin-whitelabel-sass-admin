/**
 * @author xiu
 * @date 2023/9/1
 */
Ext.define('CGP.orderstatusmodify.view.Sanction', {
    extend: 'Ext.form.FieldContainer',
    alias: 'widget.sanction',
    layout: {
        type: 'fit',
        align: 'center',
        pack: 'center',
    },
    border: 1,
    data: null,
    getName: function () {
        return this.name;
    },
    getValue: Ext.emptyFn,
    setValue: Ext.emptyFn,
    initComponent: function () {
        var me = this,
            {
                hidden,
            } = me,
            controller = Ext.create('CGP.orderstatusmodify.controller.Controller');

        if (!hidden) {
            me.items = [
                {
                    xtype: 'container',
                    style: {
                        border: '1px solid #ccc',
                        padding: '5px'
                    },
                    defaults: {
                        margin: '35 0 0 0'
                    },
                    layout: 'hbox',
                    items: [
                        {
                            xtype: 'displayfield',
                            margin: '35 0 5 20',
                            value: JSCreateFont('red', true, '注意：此订单用户为 "可疑制裁用户"', 15)
                        },
                    ]
                },
            ]
        } else {
            me.height = 0;
            me.fieldLabel = '';
        }

        me.callParent();
    }
})
