Ext.define('CGP.replenishment.view.Replenishment', {
    extend: 'Ext.form.Panel',
    alias: 'widget.replenishment',
    mixins: ['Ext.ux.util.ResourceInit'],




    bodyStyle: 'padding:15px',

    defaults: {
        width: 400,
        style: 'padding: 20px',
        disabledCls: 'custom-disabled'
    },

    plugins: [{
        ptype: 'uxvalidation'
    }],

    isValid: function () {
        this.msgPanel.hide();
        var isValid = this.callParent(arguments),
            errors = {};
        if (!isValid) {
            this.form.getFields().each(function (f) {
                if (!f.isValid()) {
                    errors[f.getFieldLabel()] = f.getErrors();
                }
            });
            this.showErrors(errors);
        }
        return isValid;
    }

    /**
     * 在信息面板显示错误信息
     * @method showErrors
     * @param {Object} errors {错误:错误信息...}
     */
    ,
    showErrors: function (errors) {
        var me = this;

        function getErrHtml(errs) {
            var html = "<ul style='color:#BA1717'>";

            function renderLi(arr) {
                var ret = "";
                for (var i = 0; i < arr.length; i++) {
                    ret += "<span>" + arr[i] + "</span>";
                }
                return ret;
            };

            function findField(name) {
                return me.getFields().findBy(function (f) {
                    return f.getName().match(new RegExp(name + '$'));
                });
            }
            if (Ext.isString(errs)) {
                Ext.Array.forEach(errs.split('|'), function (e) {
                    if (!Ext.isEmpty(e)) {
                        var f = e.split(':');
                        if (f.length > 1) {
                            var t = f[0],
                                field = findField(t);
                            if (field) {
                                t = field.getFieldLabel();
                                field.setActiveError(f[1]);
                            }
                            html += "<li>" + t + ":<span>" + f[1] + "</span></li>";
                        } else
                            html += "<li><span>" + e + "</span></li>";
                    }
                });
            } else {
                for (var v in errs) {
                    if (!Ext.isEmpty(errs[v])) {
                        html += "<li>" + v + ":<span>" + renderLi(errs[v]) + "</span></li>";
                    }
                }
            }
            html += "</ul>";
            return html;
        };
        var html = getErrHtml(errors);
        me.msgPanel.update(html);
        me.msgPanel.show();
    },


    initComponent: function () {

        var me = this;



        me.items = [{
            xtype: 'displayfield',
            fieldLabel: i18n.getKey('orderNo'),
            name: 'orderNo',
            itemId: 'orderNo'
        }, {
            xtype: 'displayfield',
            fieldLabel: i18n.getKey('existReplenishments'),
            name: 'replenishments',
            itemId: 'replenishments'
        }, {
            xtype: 'combo',
            fieldLabel: i18n.getKey('replenishmentType'),
            name: 'type',
            itemId: 'type',
            store: Ext.create('CGP.replenishment.store.ReplenishmentType'),
            displayField: 'title',
            valueField: 'value',
            value: 'B'
        }, {
            xtype: 'numberfield',
            fieldLabel: i18n.getKey('replenishmentAmount'),
            name: 'amount',
            itemId: 'amount',
            allowBlank: false,
            allowExponential: false,
            minValue: 0.1
        }, {
            xtype: 'textarea',
            fieldLabel: i18n.getKey('replenishmentReason'),
            name: 'description',
            itemId: 'description',
            allowBlank: false
        }];

        me.tbar = [{
            disabledCls: 'toolbar-button-display-none',
            xtype: 'button',
            text: i18n.getKey('save'),
            iconCls: 'icon_save',
            action: 'save'
        }, {
            disabledCls: 'toolbar-button-display-none',
            xtype: 'button',
            id: 'button-grid',
            text: i18n.getKey('grid'),
            iconCls: 'icon_grid',
            handler: function () {
                JSOpen({
                    id: 'page',
                    title: i18n.getKey('order'),
                    url: path + 'partials/order/order.html',
                    refresh: false
                });
            }
        }];

        me.callParent(arguments);

        me.msgPanel = Ext.create('Ext.panel.Panel', {
            id: 'errorMsg',
            hidden: true,
            bodyStyle: 'background-color: #F3D6D6',
            dock: 'top'
        });

        me.addDocked(me.msgPanel);

    },
    setValue: function (order) {

        var me = this;
        me.order = order;
        me.getComponent('orderNo').setValue(order.get('orderNo'));
        var replenishments = order.get('replenishments');
        console.log(order);
        me.getComponent('replenishments').setValue(replenishments.join(','));

    },

    getValue: function () {
        var me = this;

        var data = {};

        data.description = me.getComponent('description').getValue();
        data.amount = me.getComponent('amount').getValue();
        data.type = me.getComponent('type').getValue();
        return data;

    },
    toReadStatus: function () {
        var me = this;

        var toolbar = me.dockedItems.get(0);
        var saveButton = toolbar.items.get(0);
        toolbar.remove(saveButton);

        var description = me.getComponent('description');
        var type = me.getComponent('type');
        var amount = me.getComponent('amount');

        amount.setDisabled(true);
        type.setDisabled(true);
        description.setDisabled(true);

    }

})