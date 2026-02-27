/**
 * Created by nan on 2018/1/22.
 */
/**
 * Created by nan on 2018/1/22.
 */
Ext.define('CGP.partner.view.partnerorderreportconfigmanage.view.DiyEmailsFieldComponent', {
    extend: 'Ext.form.field.Display',
    alias: 'widget.diyemailsfieldcomponent',
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
                                var controller = Ext.create('CGP.partner.view.partnerorderreportconfigmanage.controller.Controller');
                                controller.addEmailOrRoleIds(me);
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
            renderTo: document.getElementById(me._contentId)
        });
        me._panel = new Ext.panel.Panel(me.panelConfig);
    },

    reset: function () {
        this._panel.removeAll();
    },

    getPanel: function () {
        return  this._panel;
    },

    getSubmitValue: function () {
        var me = this;
        var value = '';
        var fieldArray = me._panel.items.items;
        for (var i = 0; i < fieldArray.length; i++) {
            var field = fieldArray[i];
            var html = field.getValue();
            var email = html.split(">")[1];
            email = email.split("<")[0].replace(/\s+/g, '');
            value = value + email;
            if (i != fieldArray.length - 1) {
                value = value + ",";
            }
        }
        return value;
    },
    setSubmitValue: function (value) {
        var me = this;
        if (Ext.isEmpty(value)) {
            return;
        }
        var arrayEmails = value.split(",");
        me.reset();
        for (var i = 0; i < arrayEmails.length; i++) {
            me.setSingleValue(arrayEmails[i]);
        }
    },

    setSingleValue: function (value) {
        var me = this;
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
            value: "<div style='height:1px' id = '" + id + "' class='emailDiv'>" + '&nbsp&nbsp&nbsp' + value + " <img style='vertical-align: middle;width:15px; height:15px' src='" + imgurl + "' onclick='deleteEmail(\"" + id + "\")'/></div></p>"
        };
        var displayField = new Ext.form.field.Display(objDisplay, {
            padding: '0 0 0 0',
            margin: '0 0 0 0',
            border: '0 0 0 0'

        });
        var panel = me._panel;
        panel.add(displayField);
        me.totalValue++;
    }

});
window.deleteEmail = function (itemId) {
    var field = Ext.getCmp(itemId);
    field.ownerCt.remove(field);
}