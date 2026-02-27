/**
 * @Description:
 * @author nan
 * @date 2022/8/17
 */
Ext.Loader.syncRequire([
    'CGP.common.steps.StepItems',
    'CGP.common.steps.StepBar'
])
Ext.define('CGP.common.steps.StepPanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.steppanel',
    layout: 'card',
    bodyStyle: {
        borderColor: 'silver'
    },
    stepBarCfg: null,//导航节点配置
    saveHandler: null,
    defaults: {
        flex: 1,
        border: false,
        header: false,
    },
    stepDock: 'top',//导航栏的位置
    items: [],
    initComponent: function () {
        var me = this;
        me.dockedItems = [{
            itemId: 'stepDock',
            dock: me.stepDock,
            padding: 0,
            items: [
                Ext.Object.merge({
                    xtype: 'stepbar',
                    itemId: 'stepDock',
                    allowItemClick: true,
                    data: [],
                    listeners: {
                        activeChange: function (currentItem, oldItem) {
                            var me = this;
                            var panel = this.ownerCt.ownerCt;
                            console.log('activeChange');
                            var index = currentItem.index;
                            panel.getLayout().setActiveItem(index);
                            var bbar = panel.getDockedItems('toolbar[dock="bottom"]')[0];
                            var length = me.items.items.length;
                            bbar.getComponent('previous').setVisible(!(index == 0));
                            bbar.getComponent('next').setVisible(!(length - 1 == index));
                            bbar.getComponent('save').setVisible((length - 1 == index));
                        },
                        afterrender: function () {
                            var stepBar = this;
                            stepBar.fireEvent('itemClick', stepBar.items.items[0]);
                        }
                    }
                }, me.stepBarCfg)
            ]
        }];
        var navigateCount = 0;
        navigateCount = me.stepBarCfg.data.length;
        if (navigateCount > me.items.length) {
            for (; me.items.length < navigateCount;) {
                me.items.push({
                    xtype: 'panel',
                    items: [
                        {
                            xtype: 'textfield',
                            value: '空白panel_' + me.items.length
                        }
                    ]
                })
            }
        }
        me.bbar = [
            {
                text: i18n.getKey('previousStep'),
                iconCls: 'icon_previous',
                itemId: 'previous',
                handler: function (btn) {
                    var panel = btn.ownerCt.ownerCt;
                    var toolbar = panel.getDockedItems('[itemId=stepDock]')[0];
                    var stepBar = toolbar.items.items[0];
                    var index = stepBar.activeItem.index;
                    stepBar.fireEvent('itemClick', stepBar.items.items[index - 1]);
                }
            },
            '->',
            {
                text: i18n.getKey('nextStep'),
                iconCls: 'icon_next',
                itemId: 'next',
                handler: function (btn) {
                    var panel = btn.ownerCt.ownerCt;
                    var currentPanel = panel.getLayout().activeItem;
                    if (Ext.isEmpty(currentPanel.isValid) || (currentPanel.isValid && currentPanel.isValid())) {
                        var toolbar = panel.getDockedItems('[itemId=stepDock]')[0];
                        var stepBar = toolbar.items.items[0];
                        var index = stepBar.activeItem.index;
                        stepBar.fireEvent('itemClick', stepBar.items.items[index + 1]);
                    }
                }
            },
            {
                text: i18n.getKey('confirm'),
                iconCls: 'icon_save',
                hidden: true,
                itemId: 'save',
                handler: me.saveHandler || function (btn) {
                    var me = this;
                    var panel = me.ownerCt.ownerCt;
                    var toolbar = panel.getDockedItems('[itemId=stepDock]')[0];
                    var stepBar = toolbar.items.items[0];
                    panel.items.each(function (item, index, length) {
                        var isValid = item.isValid ? item.isValid() : true;
                        if (isValid == false) {
                            stepBar.fireEvent('itemClick', stepBar.items.items[index]);
                            return false;
                        }
                    })
                }
            }
        ];
        me.callParent();
    }
})