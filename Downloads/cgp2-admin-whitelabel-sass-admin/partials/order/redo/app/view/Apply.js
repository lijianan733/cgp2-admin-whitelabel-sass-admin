Ext.define('CGP.orderreprint.view.Apply', {
    extend: 'Ext.form.Panel',
    alias: 'widget.reprintapply',
    mixins: ['Ext.ux.util.ResourceInit'],


    autoScroll: true,
    bodyStyle: 'padding:10px',

    defaults: {
        style: 'margin:30px',
        msgTarget: 'side'
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


    //根据状态来确定是申请还是查看已存在的申请单
    status: 'new',

    initComponent: function () {

        var me = this;



        me.msgPanel = Ext.create('Ext.panel.Panel', {
            id: 'errorMsg',
            hidden: true,
            bodyStyle: 'background-color: #F3D6D6',
            dock: 'top'
        });
        me.items = [{
            fieldLabel: i18n.getKey('orderNo'),
            xtype: 'displayfield',
            name: 'orderNo',
            itemId: 'orderNo'
        }, {
            xtype: 'textfield',
            hidden: true,
            name: 'status',
            itemId: 'status',
            value: 'REDOED'
        }, {
            xtype: 'displayfield',
            fieldLabel: i18n.getKey('redoNo'),
            name: 'redoNo',
            itemId: 'redoNo'
        }, {
            xtype: 'textarea',
            fieldLabel: i18n.getKey('reason'),
            disabledCls: 'custom-disabled',
            name: 'reason',
            itemId: 'reason',
            width: 406,
            rows: 7,
            allowBlank: false
        }, {
            fieldLabel: i18n.getKey('productList'),
            disabledCls: 'custom-disabled',
            xtype: 'gridfield',
            name: 'lineItems',
            itemId: 'lineItems',
            listeners: {
                disable: function (display, eOpts) {
                    display.getGrid().setDisabled(true);
                }
            },
            width: 1030,
            gridConfig: {
                store: Ext.create('CGP.orderreprint.store.OrderLineItem'),
                columns: {
                    defaults: {
                        tdCls: 'vertical-middle'
                    },
                    items: [{
                        text: i18n.getKey('seqNo'),
                        dataIndex: 'seqNo',
                        width: 50
                    }, {
                        width: 150,
                        text: i18n.getKey('preview'),
                        xtype: 'componentcolumn',
                        dataIndex: 'imageUrl',
                        renderer: function (value, metadata, record) {
                            if (Ext.isEmpty(value) && Ext.isEmpty(record.get('projectImg'))) {
                                return '';
                            }
                            var imgSize = '/100/100/png';
                            return {
                                xtype: 'imagecomponent',
                                src: record.get('projectImg') ? (projectThumbServer + record.get('projectImg') + imgSize) : (value + imgSize),
                                autoEl: 'div',
                                style: 'cursor: pointer',
                                width: 100,
                                height: 100,
                                listeners: {
                                    el: {
                                        click: function () {
                                            var order = me.order;
                                            var websiteUrl = system.config.website[me.data.get('websiteCode').toLowerCase()];

                                            var html = new Ext.Template('<iframe src="' + system.config.builder_preview + '" width="100%" height="100%"></iframe').apply({
                                                website: system.config.website[me.data.get('websiteCode').toLowerCase()],
                                                projectId: record.get('projectId'),
                                                token: Ext.util.Cookies.get('token')
                                            });

                                            var window = new Ext.window.Window({
                                                width: 800,
                                                height: 600,
                                                title: i18n.getKey('preview'),
                                                html: html
                                            });

                                            window.show();
                                        }
                                    }
                                },
                            }
                        }
                    }, {
                        text: i18n.getKey('product'),
                        dataIndex: 'productName',
                        width: 200,
                    }, {
                        xtype: 'componentcolumn',
                        text: i18n.getKey('qty'),
                        renderer: function (value, metadata, record) {
                            return {
                                xtype: 'numberfield',
                                width: 50,
                                value: record.get('qty'),
                                id: 'reprint-qty' + record.get('seqNo'),
                                allowBlank: false,
                                minValue: 1,
                                allowExponential: false,
                                allowDecimals: false

                            }
                        }
                    }, {
                        xtype: 'componentcolumn',
                        text: i18n.getKey('description'),
                        width: 406,
                        disabled: true,
                        renderer: function (value, metadata, record) {
                            return {
                                xtype: 'textarea',
                                width: 406,
                                rows: 7,
                                value: record.get('description'),
                                id: 'reprint-description' + record.get('seqNo'),
                                msgTarget: 'side',
                                listeners: {
                                    afterrender: function () {
                                        this.relayEvents(Ext.getCmp('reprint-qty' + record.get('seqNo')), ['change'], 'qty');
                                        this.on('qtychange', function (qty, newValue, oldValue) {
                                            this.setDisabled(newValue == 0);
                                        })
                                    }
                                }
                            }
                        }
                        }]
                }
            },
            validate: function () {
                var me = this;
                var qty, desc, descCmp,
                    falseCount = 0;
                var valid = true;
                var me = this;
                var grid = me.getGrid();
                var store = grid.getStore();
                store.each(function (record) {
                    qty = Ext.getCmp('reprint-qty' + record.get('seqNo')).getValue();
                    descCmp = Ext.getCmp('reprint-description' + record.get('seqNo'));
                    desc = Ext.getCmp('reprint-description' + record.get('seqNo')).getValue();
                    if (qty != 0) {
                        if (!desc) {
                            descCmp.allowBlank = false;
                            if (!descCmp.isValid()) {
                                me.errors = '描述不能为空';
                                valid = false;
                            }
                        }
                    } else {
                        falseCount++;
                    }
                })

                if (falseCount == store.getCount()) {
                    valid = false;
                    me.errors = '最少有一个产品数量为1';
                }
                return valid;
            },
            getErrors: function () {
                var errors;
                if (!this.validate()) {
                    return this.errors;
                }

            },
            isValid: function () {
                return this.validate();
            }
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
                    title: i18n.getKey('orderRefund'),
                    url: path + 'partials/order/order.html',
                    refresh: false
                });
            }
        }];

        me.callParent(arguments);

        me.addDocked(me.msgPanel);

    },

    setValue: function (orderReprint, refresh) {

        var me = this;

        me.data = orderReprint;

        if (!orderReprint.get('id')) {
            me.toEditStatus();
        } else {
            me.toReadStatus();
        }


        me.items.each(function (item) {
            if (item.name == 'lineItems') {
                if (refresh) {
                    item.getGrid().getStore().removeAll();
                }
                item.getGrid().getStore().loadData(orderReprint.get('lineItems'));
            } else if (item.name == 'status') {
                item.setValue('REDOED');
            } else {
                item.setValue(orderReprint.get(item.name));
            }
        })

    },

    getGridFieldValue: function (gridfield) {

        var data = [];

        var grid = gridfield.getGrid();
        var store = gridfield.getStore();

        store.each(function (record) {

            var seqNo = record.get('seqNo');
            var qty = Ext.getCmp('reprint-qty' + seqNo).getValue();
            var description = Ext.getCmp('reprint-description' + seqNo).getValue();

            data.push({

                seqNo: seqNo,
                qty: qty,
                description: description
            })
        });

        return data;

    },

    getValue: function () {

        var me = this;

        var data = {};

        me.items.each(function (item) {

            if (item.name == 'lineItems') {
                data['lineItems'] = me.getGridFieldValue(item);

            } else {
                data[item.name] = item.getValue();
            }

        });

        return data;

    },

    toEditStatus: function () {
        var me = this;
        me.getComponent('redoNo').setVisible(false);
    },
    toReadStatus: function () {
        var me = this;
        me.getComponent('redoNo').setVisible(true);
        var toolbar = me.dockedItems.get(0);
        var saveButton = toolbar.items.get(0);
        toolbar.remove(saveButton);
        var reason = me.getComponent('reason');
        var lineItems = me.getComponent('lineItems');
        reason.setDisabled(true);
        lineItems.setDisabled(true);
    }

})