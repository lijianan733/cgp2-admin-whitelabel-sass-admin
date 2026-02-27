/**
 * ProductManager
 * @Author: miao
 * @Date: 2022/2/21
 */
Ext.define("CGP.product.view.procductManage.view.UserComponent", {
    extend: 'Ext.form.field.Display',
    alias: 'widget.usercomp',
    require: [
        'Ext.panel.Panel'
    ],
    _panel: null,
    fieldText: {
        saveSuccess: 'Save Successfully',
        prompt: 'prompt',
        cancel: 'Cancel',
        save: 'Save',
        add: 'Add',
        emailFormatError: 'Email Format Error',
        Email: "Email",
        setAddressee: 'Set Addressee'
    },
    selType: 'rowmodel',
    disabledCls: '',
    _contentId: null,
    totalValue: 0,
    emailWidth: 245,
    initComponent: function () {
        var me = this;
        initResource(me.fieldText);

        me.callParent(arguments);
        if (!me.panelConfig) {
            throw new Error('panelConfig can not be null!');
        }
        me.panelConfig = Ext.merge({
            width: 50,
            layout: 'anchor',
            disabledCls: '',
            dockedItems: [
                {
                    xtype: 'toolbar',
                    dock: 'right',
                    width: 80,
                    layout: {
                        type: 'vbox',
                        align: 'center'
                    },
                    items: [
                        {
                            xtype: 'button',
                            dock: 'right',
                            iconCls: 'icon_add',
                            width: 60,
                            margin: '5 0 0 5',
                            margin: '5 0 0 5',
                            text: i18n.getKey('add'),
                            handler: function (button) {
                                var controller = Ext.create('CGP.product.view.procductManage.controller.Controller');
                                controller.addProductManager(me);
                            }
                        }
                    ]
                }
            ],
            id: 'editAddresseeWin',
            items: []
        }, me.panelConfig);
        me._contentId = me.panelConfig.renderTo || "panelfield-content-id";
        var width = me.panelConfig.width = me.panelConfig.width || 200;
        var value = '<div id="' + me._contentId + '" ></div>';
        me.setValue(value);
        me.on("disable", function (display) {
            display.getPanel().setDisabled(true);
        });
    },
    onRender: function () {
        this.callParent(arguments);
        this.initPanel();
    },
    initPanel: function () {
        var me = this;
        me.panelConfig = Ext.merge(me.panelConfig, {
            bodyStyle: {
                borderColor: 'silver'
            },
            renderTo: document.getElementById(me._contentId)
        });
        me._panel = new Ext.panel.Panel(me.panelConfig);
    },
    reset: function () {
        var me = this;
        me.compValue = [];
        me._panel.removeAll();
    },
    getPanel: function () {
        return this._panel;
    },
    setDiyValue: function (value) {
        var me = this;
        me.reset();
        var user = Ext.JSON.decode(Ext.util.Cookies.get("user"));
        if (Ext.isArray(value)) {
            //当前用户不是该产品管理员，不可操作
            var arrUser = value.map(function (el) {
                return el.email;
            });
            if (arrUser.length > 0 && Ext.Array.indexOf(arrUser, user.email) < 0) {
                me.disable();
                me.ownerCt.ownerCt.isProductManager = false;
            }

            for (var i = 0; i < value.length; i++) {
                me.setSingleValue(value[i]);
            }
        } else {
            me.setSingleValue(value);
            //当前用户不是该产品管理员，不可操作
            if (user.email != value.email) {
                me.disable();
                me.ownerCt.ownerCt.isProductManager = false;
            }
        }

    },
    setSingleValue: function (value) {
        var me = this;
        var controller = Ext.create('CGP.product.view.procductManage.controller.Controller');
        me.totalValue = me.totalValue + 1;
        var imgurl = path + 'ClientLibs/extjs/resources/themes/images/shared/fam/remove.png';
        var totalValue = me.totalValue;
        var id = me.id + totalValue;
        var width = (me._panel.width - 10) / 2;
        var objDisplay = {
            id: id,
            height: '1px',
            style: 'text-align: right;display:inline-block;*display:inline;*zoom:1;height:1px',
            hideLabel: true,
            disabled: me.isView,
            // value: "<div style='height:1px' id = '" + id + "' class='emailDiv'>" + '&nbsp&nbsp&nbsp' + value.email + '(' + value.userId + ')' + " <img style='vertical-align: middle;width:15px; height:15px' src='" + imgurl + "' /></div></p>",
            value: "<div style='height:1px' id = '" + id + "' class='emailDiv'>" + '&nbsp&nbsp&nbsp' + value.email + " <img style='vertical-align: middle;width:15px; height:15px' src='" + imgurl + "' /></div></p>",
            listeners: {
                render: function (display) {
                    var clickElement = display.getEl().down('img');
                    clickElement.addListener('click', function () {
                        Ext.Msg.confirm(i18n.getKey('prompt'), i18n.getKey('deleteConfirm'), function (opt) {
                            if (opt == 'yes') {
                                controller.deleteManager(me, value.email, display);
                            }
                        });
                    });
                }
            }
        };
        var displayField = new Ext.form.field.Display(objDisplay, {
            padding: '0 0 0 0',
            margin: '0 0 0 0',
            disabledCls: '',
            border: '0 0 0 0'

        });
        var panel = me._panel;
        if (Ext.isEmpty(me.compValue)) {
            me.compValue = [];
        }
        me.compValue.push(value);
        panel.add(displayField);
        me.totalValue++;
    },
    getDiyValue: function () {
        var me = this;
        return me.compValue || [];
    }
});