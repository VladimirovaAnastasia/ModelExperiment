import numpy as np
import math
import numpy.random as r
import matplotlib.pyplot as plt


def f(x):
    return (np.exp(x) - np.exp(-x)) / (np.exp(x) + np.exp(-x))


def derivative_f(x):
    return (1 - f(x) * f(x))


def setup_and_init_weights(structure):
    W = {}
    b = {}
    for l in range(1, len(structure)):
        W[l] = r.random_sample((structure[l], structure[l - 1]))
        b[l] = np.ones((structure[l],))
    return W, b


def init_delta_values(structure):
    delta_W = {}
    delta_b = {}
    for l in range(1, len(structure)):
        delta_W[l] = np.zeros((structure[l], structure[l - 1]))
        delta_b[l] = np.zeros((structure[l],))
    return delta_W, delta_b


def calculation_of_sum_and_F_activation(x, W, b):
    h = {1: x}
    z = {}
    for l in range(1, len(W) + 1):
        if l == 1:
            in_neurons = x
        else:
            in_neurons = h[l]
        z[l + 1] = W[l].dot(in_neurons) + b[l]
        h[l + 1] = f(z[l + 1])
    return h, z


def calculation_layer_delta(y, h_out, z_out):
    return (h_out - y) * derivative_f(z_out)


def calculation_layer_difference(y, h_out):
    return (h_out - y)


def calculation_hidden_layer_delta(delta_layer_delta, w_l, z_l):
    return np.dot(np.transpose(w_l), delta_layer_delta) * derivative_f(z_l)


def predict_y(Weights, betta, X, Y):
    error_func = []
    m = len(Y)
    for j in range(m):
        h, z = calculation_of_sum_and_F_activation(X[j, :], Weights, betta)
        print(j)
        print(h[3])
        print(Y[j, 0])
        #error = pow((Y[j, 0] - h[3]), 2)
        #error_func.append(error)

    #plt.plot(error_func)
    #plt.ylabel('Погрешность обучения')
    #plt.xlabel('Выборки')
    #plt.show()


def getPrediction(x, y, delay):
    counter = 0
    alpha = 0.1
    counter = 0
    delta = {}
    k_func = []
    # входной слой
    enter = 2
    # количество нейронов в скрытом слое
    hidden_layout = 2
    # количество нейронов в выходном слое
    exit = 1
    # Количество эпох обучения
    epoch = 500
    structure = [enter, hidden_layout, exit]

    coef = (np.sqrt(np.sum(np.square(x), axis=1)))
    X_new = np.repeat(coef, enter).reshape(len(x), enter)
    X = x / X_new
    Y = y
    print(len(x))
    trainData = len(x) * 9 // 10
    print(trainData)
    testData = len(x) - trainData
    print(testData)
    X_train = np.vstack((X[0:trainData, 0:enter]))
    Y_train = np.vstack((Y[0:trainData, 0]))
    print(trainData)
    print(testData)
    X_test = np.vstack((X[trainData:len(x), 0:enter]))
    print(X_test)
    Y_test = np.vstack((Y[trainData:len(x), 0]))

    # X_train = np.vstack((X[0:len(x), 0:enter]))
    # Y_train = np.vstack((Y[0:len(x), 0]))

    W, b = setup_and_init_weights(structure)

    while counter < epoch:
        W_delta, b_delta = init_delta_values(structure)
        k = 0
        i = 0
        for i in range(len(Y_train)):
            delta = {}
            h, z = calculation_of_sum_and_F_activation(X_train[i, :], W, b)
            delta[3] = calculation_layer_delta(Y_train[i, 0], h[3], z[3])
            k += pow((Y_train[i, 0] - h[3]), 2)
            delta[2] = calculation_hidden_layer_delta(delta[3], W[2], z[2])
            W_delta[2] += np.dot(delta[3][:, np.newaxis], np.transpose(h[2][:, np.newaxis]))
            b_delta[2] += delta[3]
            W_delta[1] += np.dot(delta[2][:, np.newaxis], np.transpose(h[1][:, np.newaxis]))
            b_delta[1] += delta[2]

            W[1] = W[1] - alpha * W_delta[1]
            b[1] = b[1] - alpha * b_delta[1]
            W[2] = W[2] - alpha * W_delta[2]
            b[2] = b[2] - alpha * b_delta[2]

            W_delta[1] = 0
            W_delta[2] = 0
            b_delta[1] = 0
            b_delta[2] = 0

        s = np.sum(k)
        n = 1

        # k = math.sqrt(s / (n * (p - 1))) * X_new
        k = math.sqrt(s / (n * (epoch - 1)))
        if counter == 1:
            print(1)
        if counter == 25:
            print(25)
        if counter == 50:
            print(50)
        if counter == 75:
            print(75)
        if counter == 100:
            print(100)
        if counter == 125:
            print(125)
        if counter == 150:
            print(150)
        if counter == 200:
            print(200)
        if counter == 400:
            print(400)
        if counter == 499:
            print('Итоговая погрешность', k)
        if counter == 600:
            print(600)
        k_func.append(k)
        counter += 1

    plt.plot(k_func)
    plt.ylabel('Погрешность')
    plt.xlabel('Количество итераций')
    plt.show()

    predict_y(W, b, X_test, Y_test)
