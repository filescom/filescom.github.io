

X = float(input('Введите координату X: '))
Y = float(input('Введите координату Y: '))

if X > 0 and Y > 0: 
    print('1')
elif X < 0 and Y > 0:
    print('2')
elif X < 0 and Y < 0:
    print('3')
elif X > 0 and Y < 0:
    print('4')
else:
    print('Введены неверные координаты')