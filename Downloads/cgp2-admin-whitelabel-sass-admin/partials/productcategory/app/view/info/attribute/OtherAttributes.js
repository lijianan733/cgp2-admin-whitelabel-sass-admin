Ext.define('CGP.productcategory.view.info.attribute.OtherAttributes', {
    extend: 'Ext.grid.Panel',

    alias: 'widget.otherattributes',
    mixins: ['Ext.ux.util.ResourceInit'],


    multiSelect: true,
    selModel: new Ext.selection.CheckboxModel({
        checkOnly: false
    }),

    viewConfig: {
        enableTextSelection: true,
        plugins: {
            ptype: 'gridviewdragdrop',
            ddGroup: 'selDD',
            enableDrag: true,
            enableDrop: true
        }
    },



    initComponent: function () {

        var me = this;



        me.title = i18n.getKey('otherAttribute');
        me.tbar = [{
            id: 'idSearchField',
            name: 'id',
            xtype: 'numberfield',
            hideTrigger: true,
            labelWidth: 40,
            width : 180,
            autoStripChars: true,
            allowExponential: false,
            allowDecimals: false,
            fieldLabel: i18n.getKey('id'),
            itemId: 'id'
        },{
            xtype: 'textfield',
            labelWidth: 40,
            width : 180,
            fieldLabel: i18n.getKey('name'),
            itemId: 'nameSearch'
        }, {
            xtype: 'button',
            iconCls: 'icon_query',
            text: i18n.getKey('search'),
            action: 'search'
        }];
        me.columns = [{
            text: i18n.getKey('id'),
            width: 150,
            dataIndex: 'id',
            itemId: 'id',
            sortable: true
        },{
            dataIndex: 'name',
            text: i18n.getKey('name'),
            width : 200,
            renderer : function(value, metadata, record){
                metadata.tdAttr = 'data-qtip="'+"<div>"+value+"</div>"+'"';
                return value;
            }
        },{
            text : i18n.getKey('code'),
            dataIndex : "code",
            renderer : function(value, metadata, record){
                metadata.tdAttr = 'data-qtip="<div>'+value+'</div>"';
                return value;
            }
        }];

        me.store = Ext.create('CGP.productcategory.store.Attribute', {
            url: me.url
        })

        me.callParent(arguments);

    },
    onRender : function(){
        var me = this;
        me.callParent(arguments);
        me.el.on('keydown', function (event, target) {
            if (event.button == 12) {
                var button = me.child("toolbar").child("button");
                if (button) {
                    button.fireEvent("click");
                }
            }
        }, me);
    }

});
