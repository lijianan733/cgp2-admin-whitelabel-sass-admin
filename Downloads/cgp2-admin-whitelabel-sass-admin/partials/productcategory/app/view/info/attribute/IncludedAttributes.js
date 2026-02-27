Ext.define('CGP.productcategory.view.info.attribute.IncludedAttributes', {
    extend: 'Ext.grid.Panel',

    alias: 'widget.includedattributes',
    mixins: ['Ext.ux.util.ResourceInit'],



    multiSelect: true,
    selType: 'checkboxmodel',

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




        me.title = i18n.getKey('categoryAttributes');
        me.columns = [
            {
                dataIndex: 'id',
                text: i18n.getKey('id'),
                width : 80,
            },{
            text: i18n.getKey('operation'),
            xtype: 'componentcolumn',
            renderer: function (value, metadata, record) {
                return {
                    xtype: 'button',
                    text: i18n.getKey('setValue'),
                    action: 'setvalue',
                    value: record.get('id')
                }
            }
        }, {
            dataIndex: 'name',
            text: i18n.getKey('name'),
            renderer: function(value, metadata, record){
            	metadata.tdAttr = 'data-qtip="' + "<div>"+value+"</div>"+ '"';
            	return value;
            }
        },{
        	text : i18n.getKey('code'),
        	dataIndex : "code",
        	renderer : function(value, metadata, record){
        		metadata.tdAttr = 'data-qtip="<div>'+value+'</div>"';
        		return value;
        	}
        }, {
            dataIndex: 'value',
            text: i18n.getKey('value'),
            renderer: function (value, metadata, record) {
                var options = record.get('options');
                if (Ext.isEmpty(options)) {
                	metadata.tdAttr = 'data-qtip="' + "<div>"+value+"</div>"+ '"';
                    return value;
                }
                if (!Ext.isEmpty(value)) {
                    var optionIds = value.split(',');
                    var value = [];
                    Ext.Array.each(optionIds, function (optionId) {
                        Ext.Array.each(options, function (option) {
                            if ((option.id + '') == optionId) {
                                value.push(option.name);
                                return false;
                            }
                        })
                    })
                    metadata.tdAttr = 'data-qtip="' + "<div>"+value.join(',')+"</div>"+ '"';
                    return value.join(',');
                }
            }
        }, {
            dataIndex: 'showInFrontend',
            text: i18n.getKey('showInFrontend')
        }, {
            dataIndex: 'useInCategoryNavigation',
            text: i18n.getKey('useInCategoryNavigation')
        }, /*{
            dataIndex: 'sortOrder',
            text: i18n.getKey('sortOrder')
        }, {
            dataIndex: 'belongToParent',
            text: i18n.getKey('belongToParent')
        }*/];

        me.store = Ext.create('CGP.productcategory.store.Attribute', {
            url: me.url
        });

        me.callParent(arguments);
    }
})
