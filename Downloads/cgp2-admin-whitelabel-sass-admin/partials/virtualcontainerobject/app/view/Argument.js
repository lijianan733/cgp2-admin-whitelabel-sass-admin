/**
 * Created by miao on 2021/10/11.
 */
// Ext.Loader.setPath('CGP.virtualcontainerobject', '../../app');
Ext.define("CGP.virtualcontainerobject.view.Argument", {
    extend: 'Ext.form.Panel',
    alias: 'widget.argument',
    defaults :{
        margin: '5 20',
        labelAlign: 'left'
    },
    // requires:[
    //     'CGP.virtualcontainerobject.view.argument.GeneralArgument',
    //     'CGP.virtualcontainerobject.view.argumentbuilder.BuilderArgument'
    // ],
    initComponent: function () {
        var me = this;
        var controller=Ext.create('CGP.virtualcontainerobject.controller.VirtualContainerObject');
        me.items = [
            {
                xtype: 'radiogroup',
                itemid: 'argumentType',
                fieldLabel: i18n.getKey('argumentType'),
                style:'height:34;valign:middle;',
                // vertical: true,
                columns: 2,
                width: 500,
                items: [
                    {
                        boxLabel: i18n.getKey('argument'), name: 'argumentType', inputValue: 'argument',
                        checked: true
                    },
                    {
                        boxLabel: i18n.getKey('argumentBuilder'),
                        name: 'argumentType',
                        inputValue: 'argumentBuilder'
                    }
                ],
                listeners: {
                    change: function (comp, newValue, oldValue) {
                        var generalArgument = comp.ownerCt.getComponent('generalArgument'),
                            argumentBuilder = comp.ownerCt.getComponent('builderArgument');
                        var triggerShow = function (showComp, hideComp) {
                            hideComp.hide();
                            hideComp.disable();
                            showComp.show();
                            showComp.enable();
                            if(!showComp.rendered){
                                showComp.setValue(showComp.data);
                            }
                        }
                        if (newValue?.argumentType == 'argument') {
                            triggerShow(generalArgument, argumentBuilder);
                        } else {
                            triggerShow(argumentBuilder, generalArgument);
                        }
                    }
                }
            },
            {
                xtype: 'generalargument',
                itemId: 'generalArgument',
                name: 'argument',
                border: 0,
                listeners: {
                    show:controller.showArgument
                }
            },
            {
                xtype: 'builderargument',
                itemId: 'builderArgument',
                name: 'argumentBuilder',
                hidden: true,
                height: 500,
                border: 0,
                listeners: {
                    show:controller.showArgument
                }
            }
        ];
        me.callParent(arguments);
    },
    isValid: function () {
        var me = this;
        var isValid = true;
        if (!me.rendered) {
            return isValid
        }
        me.items.items.forEach(function (item) {
            if (!item.hidden && item.isValid() == false) {
                isValid = false;
            }
        });
        return isValid;
    },
    setValue: function (data) {
        var me = this;
        var items = me.items.items;
        for (var item of items) {
            if (item.xtype == 'radiogroup') {
                if (data.argumentBuilder) {
                    item.setValue({argumentType: "argumentBuilder"});
                }
                else{
                    item.setValue({argumentType: "argument"});
                }
            }
            else{
                item.setValue(data[item.name]);
            }
        }
    },
    getValue: function () {
        var me = this, data = {};
        var items = me.items.items;
        for (var item of items) {
            if (item.hidden || item.xtype == 'radiogroup') {
                continue;
            }
            data[item.name] = item.getValue();
        }
        return data;
    }
})
