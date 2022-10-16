import MdEditor from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';

MdEditor.config({
  editorConfig: {
    languageUserDefined: {
      'ru-ru': {
        toolbarTips: {
          bold: 'жирный',
          underline: 'подчеркнутый',
          italic: 'курсивный',
          strikeThrough: 'зачеркнутый',
          title: 'заголовок',
          sub: 'subscript',
          sup: 'superscript',
          quote: 'цитата',
          unorderedList: 'ненумерованный список',
          orderedList: 'нумерованный список',
          codeRow: 'код',
          code: 'блок кода',
          link: 'ссылка',
          image: 'изображение',
          table: 'таблица',
          mermaid: 'диаграмма',
          katex: 'формула',
          revoke: 'отменить',
          next: 'вперед',
          save: 'сохранить',
          prettier: 'prettier',
          pageFullscreen: 'раскрыть на всё окно',
          fullscreen: 'полноэкранный режим',
          preview: 'предпросмотр',
          htmlPreview: 'html предпросмотр',
          catalog: 'оглавление',
          github: 'репозиторий автора дополнения',
        },
        titleItem: {
          h1: 'Заголовок 1',
          h2: 'Заголовок 2',
          h3: 'Заголовок 3',
          h4: 'Заголовок 4',
          h5: 'Заголовок 5',
          h6: 'Заголовок 6',
        },
        imgTitleItem: {
          link: 'Добавить изображение по ссылке',
          upload: 'Загрузить изображение',
          clip2upload: 'Обрезать и загрузить',
        },
        linkModalTips: {
          title: 'Добавить ',
          descLable: 'Описание:',
          descLablePlaceHolder: 'Введите описание...',
          urlLable: 'Ссылка:',
          UrlLablePlaceHolder: 'Введите ссылку...',
          buttonOK: 'OK',
        },
        clipModalTips: {
          title: 'Обрезать изображение',
          buttonUpload: 'Загрузить',
        },
        copyCode: {
          text: 'Копировать',
          successTips: 'Скопировано!',
          failTips: 'Ошибка копирования!',
        },
        mermaid: {
          flow: 'flow',
          sequence: 'sequence',
          gantt: 'gantt',
          class: 'class',
          state: 'state',
          pie: 'pie',
          relationship: 'relationship',
          journey: 'journey',
        },
        katex: {
          inline: 'inline',
          block: 'block',
        },
        footer: {
          markdownTotal: 'Количество слов',
          scrollAuto: 'Автоматическое прокручивание',
        },
      },
    },
  },
});

export default MdEditor;
