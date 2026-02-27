
function onDivClick(groupTitle,id){
	
		signId = id;
		signText = groupTitle;
		var value = Ext.getCmp('configPage').getComponent('west').getComponent('website').getValue();
		var websiteId = null;
		var websiteCode = null;
		var websiteStore = Ext.data.StoreManager.lookup('websiteStore');
		websiteStore.each(function(record){
			if(record.get('id') == value){
				websiteId = record.get('id');
				websiteCode = record.get('code');
			}
		});
		
		store.each(function(record){
				var groupId = record.get('id');
				var el = document.getElementById(groupId.toString());
				if(el != null){
					el.className = "normal";
				}
		});
		//当点击的是邮件模版时
        if(groupTitle == "mailTemplate"){
            var url = '../config/mailtemplatetabs.html?website=' + websiteCode +'&websiteId=' + websiteId;
            Ext.getCmp('configPage').getComponent('center').removeAll();
            Ext.getCmp('configPage').getComponent('center').add({
                layout:'fit',
                html:'<iframe id="tabs_iframe_' + "mail_template" + '" ' +
                    'src="' + url+ '" width="100%" height="100%"' +
                    ' frameBorder="0" onactivate="Ext.menu.MenuMgr.hideAll();">' +
                    '</iframe>',
                closeable:true
            });
            document.getElementById("sendMailCfg").className = "normal";
            document.getElementById("mailTemplate").className = "change";
        }else if(groupTitle == 'sendMailCfg'){
            var url = '../config/sendmail.html?website=' + websiteCode +'&websiteId=' + websiteId;
            Ext.getCmp('configPage').getComponent('center').removeAll();
            Ext.getCmp('configPage').getComponent('center').add({
                layout:'fit',
                html:'<iframe id="tabs_iframe_' + "mail_template" + '" ' +
                    'src="' + url+ '" width="100%" height="100%"' +
                    ' frameBorder="0" onactivate="Ext.menu.MenuMgr.hideAll();">' +
                    '</iframe>',
                closeable:true
            });
            document.getElementById("mailTemplate").className = "normal";
            document.getElementById("sendMailCfg").className = "change";
        }
        // 当点击的不是邮件模版时
        else {
            var url = '../config/' + id + '.html?website=' + websiteCode +'&websiteId=' + websiteId;
            Ext.getCmp('configPage').getComponent('center').removeAll();
            Ext.getCmp('configPage').getComponent('center').add({
                layout:'fit',
                html:'<iframe id="tabs_iframe_' + id + '" ' +
                    'src="' + url+ '" width="100%" height="100%"' +
                    ' frameBorder="0" onactivate="Ext.menu.MenuMgr.hideAll();">' +
                    '</iframe>',
                closeable:true
            });
            document.getElementById("mailTemplate").className = "normal";
            document.getElementById("sendMailCfg").className = "normal";
            if(!Ext.isEmpty(document.getElementById(id.toString()))){
                document.getElementById(id.toString()).className = "change";
            }
        }
}

