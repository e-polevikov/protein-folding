# Задача "Сворачивание белка" для конкурса КИО

Задача "Сворачивание белка" для конкурса КИО. Демо доступно по ссылке: [https://e-polevikov.github.io/protein-folding/](https://e-polevikov.github.io/protein-folding/). Исходный код основной логики эксперимента находится в данном файле: [ProteinFolding.js](https://github.com/e-polevikov/protein-folding/blob/main/src/ProteinFolding.js).

> [!WARNING]  
> Проект находится на ранней стадии разработки, часть функциональности ещё не реализована. В частности, не реализована валидация значений параметров.

## Описание

В начале эксперимента на плоскости случайным образом генерируется белок. Белок представляет из себя набор частиц (окружностей). 

При нажатии кнопки _Старт_ частицы начинаются двигаться случайным образом. После того, как одна из частиц сдвинулась, вычисляется полная энергия взаимодействия всех частиц. Если полная энергия оказывается меньше, чем на предыдущем шаге, то частица остается в своем новом положении. Если же значение полной энергии больше, чем на предыдущем шаге, то частица остается в своем новом положении с вероятнотью `P`. Значание по умолчанию для данной вероятность равно `0.1`, его можно менять в панели параметров эксперимента.

При нажатии кнопки _Пауза_ эксперимент останавливается (частицы перестают двигаться). Нажав на кнопку _Старт_ эксперимент можно возобновить.

Помимо вероятности `P` также можно задать радус частиц и их количество. Если параметры изменились, то нужно нажать кнопку _Обновить_. После этого белок сгенерируется заново случайным образом, и после этого можно будет начать новый эксперимент.

Также в панели слева помимо параметров отображается минимальное и текущее значение энергии, умноженное на `10^10` и округленное до двух знаков после запятой.
