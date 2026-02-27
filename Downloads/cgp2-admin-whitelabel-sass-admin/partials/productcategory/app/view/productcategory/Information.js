Ext.define('CGP.productcategory.view.productcategory.Information', {
    extend: 'Ext.tab.Panel',
    alias: 'widget.productcategoryinfo',
    mixins: ['Ext.ux.util.ResourceInit'],
    requires: [
        'CGP.productcategory.view.info.Desc',
        'CGP.productcategory.view.info.Template',
        'CGP.productcategory.view.info.attribute.Attribute',
        'CGP.productcategory.view.info.background.view.CategoryBackgroundGrid'
    ],


    componentInit: false,
    listeners: {
        tabchange: function (tabPanel, newPanel, oldPanel) {
            var toolbar = tabPanel.getDockedItems('toolbar[dock="top"]')[0];
            if (newPanel.itemId == 'categoryBackgroundGrid') {
                toolbar.hide();
            } else {
                toolbar.show();
            }
        }
    },
    initComponent: function () {

        var me = this;


        me.tbar = Ext.create('Ext.toolbar.Toolbar', {
            items: [{
                itemId: 'btnSave',
                text: i18n.getKey('save'),
                disabled: true,
                iconCls: 'icon_save',
                action: 'save'
            }]
        });

        me.title = i18n.getKey('information');
        /*        me.tools = [{
                    xtype: 'toolbar',
                    itemId: 'headerTool',
                    style: 'background-color:#157FCC',
                    border: false,
                    items: [{
                        xtype: 'image',
                        width: 18,
                        action: 'expand',
                        height: 18,
                        src: '../../ClientLibs/extjs/resources/themes/images/ux/layout_left.png',
                        autoEl: 'div'
                    }]
                }]*/
        ;
        //        me.items = [{
        //            xtype: 'infodesc'
        //        }, {
        //            xtype: 'infotemplate',
        //        }];
        var attributePanel = {
            xtype: 'infoattribute',
            categoryId: me.categoryId
        };


        me.callParent(arguments);

    },


    refreshData: function (record) {
        var me = this;
        if (!me.componentInit)
            me.addComponent();
        me.recordId = record.get('id');
        me.setTitle(i18n.getKey('information') + ':' + record.get('name'));
        Ext.Array.each(me.items.items, function (item) {
            item.refreshData(record);
        })

        me.setActive(me.items.items[0])

    },

    addComponent: function () {

        var me = this;
        var saveButton = me.child("toolbar").getComponent("btnSave");
        saveButton.setDisabled(false);
        me.add([Ext.widget({
            xtype: 'infodesc'
        }), Ext.widget({
            xtype: 'infotemplate'
        })
        ])

        if (me.isMain) {
            me.add(Ext.widget({
                xtype: 'infoattribute'
            }));
        } else {
            me.add(Ext.widget({
                xtype: 'categorybackgoundpanel'
            }));
        }
        me.componentInit = true;
    }
})