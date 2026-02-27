/**
 * Created by nan on 2021/4/22
 */

Ext.define('CGP.product.view.productconfig.productviewconfig.view.viewconfigV2.config.Config', {
    statics:{
        componentInfo: {
            'common': ['clazz', 'componentPath', 'id'],
            'com.qpp.cgp.domain.product.config.view.builder.config.H1NavBarConfig': ['enableNavButton'],
            'com.qpp.cgp.domain.product.config.view.builder.config.DiceNavBarConfig': ['faces', 'styling'],
            'com.qpp.cgp.domain.product.config.view.builder.config.ImageLibraryConfig': [
                'title',
                /*'actions',*/
                'informationLanguageKey',
                'informationVariable',
                'informationVariableValueEx',
                'maxFileSize',
                'maxFileSizeUnit',
                'fileExtensions',
                'fileFilters',
                'showOpenLibrary',
                'showAutoFill',
                'fileConfig',
                'imageConfig',//图片信息配置的几个属性
                'showSetBackground'/*,
            'setBackgroundWithColor',//idReference,由showSetBoackground值来控制*/
            ],
            'com.qpp.cgp.domain.product.config.view.builder.config.BackgroundLibraryConfig': ['title'/*, 'actions'*/],
            'com.qpp.cgp.domain.product.config.view.builder.config.ColorLibraryConfig': ['title'/*, 'actions'*/],
            'com.qpp.cgp.domain.product.config.view.builder.config.FontLibraryConfig': ['title'/*, 'actions'*/],
            'com.qpp.cgp.domain.product.config.view.builder.config.ToolBarConfig': ['toolButtons'],
            'com.qpp.cgp.domain.product.config.view.builder.config.ToolTipsConfig': ['toolTips'],
            'com.qpp.cgp.domain.product.config.view.builder.config.SingleViewUploadEditBoardConfig': [
                'editors',
                'scrollY',
                'fileConfig',//这是上传的几个属性
                'downloadStrategy',
                'downloadTemplateName',
                'tipsLanguageKey',
                'informationTemplateName'
            ],
            'com.qpp.cgp.domain.product.config.view.builder.config.SingleViewBoardConfig': [
                'editors',
                'scrollY',
            ],
            'com.qpp.cgp.domain.product.config.view.builder.config.SingleViewEditBoardConfig': [
                'editors',
                'scrollY',
            ],
            'com.qpp.cgp.domain.product.config.view.builder.config.MultiViewUploadEditBoardConfig': [
                'editors',
                'scrollY',
            ],
            'com.qpp.cgp.domain.product.config.view.builder.config.SingleViewPreviewBoardConfig': [
                'editors',
                'scrollY',
            ],
            'com.qpp.cgp.domain.product.config.view.builder.config.AssistBarConfig': [
                'assistants'
            ],
            'com.qpp.cgp.domain.product.config.view.builder.config.CalendarNavBarConfig': [
                'startMonthValueEx',
                'totalValueEx'
            ],
            'com.qpp.cgp.domain.product.config.view.builder.config.PagingNavBarConfig': [],
            'com.qpp.cgp.domain.product.config.view.builder.config.ImageButtonNavBarConfig': ['buttons'],
            'com.qpp.cgp.domain.product.config.view.builder.config.ThreeDPreviewBoardConfig': ['model', 'pageScale', 'assets'],
            'com.qpp.cgp.domain.product.config.view.builder.config.ColorPropertyLibraryConfig': ['color', 'title']
        },
        componentMapping: {
            'H1NavBar': ['com.qpp.cgp.domain.product.config.view.builder.config.H1NavBarConfig'],
            'DiceNavBar': ['com.qpp.cgp.domain.product.config.view.builder.config.DiceNavBarConfig'],
            'ImageLibrary': ['com.qpp.cgp.domain.product.config.view.builder.config.ImageLibraryConfig'],
            'BackgroundLibrary': ['com.qpp.cgp.domain.product.config.view.builder.config.BackgroundLibraryConfig'],
            'FontLibrary': ['com.qpp.cgp.domain.product.config.view.builder.config.FontLibraryConfig'],
            'ColorLibrary': ['com.qpp.cgp.domain.product.config.view.builder.config.ColorLibraryConfig'],
            'ToolTips': ['com.qpp.cgp.domain.product.config.view.builder.config.ToolTipsConfig'],
            'ToolBar': ['com.qpp.cgp.domain.product.config.view.builder.config.ToolBarConfig'],
            'SingleViewBoard': ['com.qpp.cgp.domain.product.config.view.builder.config.SingleViewBoardConfig'],
            'SingleViewEditBoard': ['com.qpp.cgp.domain.product.config.view.builder.config.SingleViewEditBoardConfig'],
            'SingleViewUploadEditBoard': ['com.qpp.cgp.domain.product.config.view.builder.config.SingleViewUploadEditBoardConfig'],
            'MultiViewUploadEditBoard': ['com.qpp.cgp.domain.product.config.view.builder.config.MultiViewUploadEditBoardConfig'],
            'AssistBar': ['com.qpp.cgp.domain.product.config.view.builder.config.AssistBarConfig'],
            'SingleViewPreviewBoard': ['com.qpp.cgp.domain.product.config.view.builder.config.SingleViewPreviewBoardConfig'],
            'CalendarNavBar': ['com.qpp.cgp.domain.product.config.view.builder.config.CalendarNavBarConfig'],
            'PagingNavBar': ['com.qpp.cgp.domain.product.config.view.builder.config.PagingNavBarConfig'],
            'ImageButtonNavBar': ['com.qpp.cgp.domain.product.config.view.builder.config.ImageButtonNavBarConfig'],
            'ThreeDPreviewBoard': ['com.qpp.cgp.domain.product.config.view.builder.config.ThreeDPreviewBoardConfig'],
            'ColorPropertyLibrary': ['com.qpp.cgp.domain.product.config.view.builder.config.ColorPropertyLibraryConfig']
        },
    }
})