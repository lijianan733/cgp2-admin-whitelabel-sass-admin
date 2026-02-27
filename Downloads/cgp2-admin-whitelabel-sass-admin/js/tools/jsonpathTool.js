
Ext.define("CGP.tools.jsonpathTool", {
    extend: "Ext.panel.Panel",
    //title: i18n.getKey(''),
    region: 'center',
    width: '65%',
    minWidth: 250,
    state: 'initial',
    itemId: 'jsonpathTool',
    //split: true,
    //collapsible: true,
    initComponent: function(){
        var vm = this;
        vm.html = '<iframe id="tabs_iframe_' + 'pcCompare' + '" src="' +'https://jsonpath.curiousconcept.com/#' + '" width="100%" height="100%" frameBorder="0" onactivate="Ext.menu.MenuMgr.hideAll();"></iframe>';
        vm.callParent(arguments);
        //vm.mask = vm.setLoading('请选择PC!');
    }
});
