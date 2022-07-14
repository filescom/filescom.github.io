number = int(input("Введите номер дня недели "))
if number <= 0 or number > 7:
    print('Введены неверные данные')
elif number <=5:
    print('Нет')
elif number > 5:
    print('Да')

