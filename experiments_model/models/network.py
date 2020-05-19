import numpy as np
import numpy.random as r
import matplotlib.pyplot as plt


def f(x):
    # th
    # return (np.exp(x) - np.exp(-x)) / (np.exp(x) + np.exp(-x))
    # sigmoid
    return 1 / (1 + np.exp(-x))


def derivative_f(x):
    # th
    # return 4 / ((np.exp(x) + np.exp(-x)) * (np.exp(x) + np.exp(-x)))
    # sigmoid
    return f(x) * (1 - f(x))


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
    # log loss
    return h_out - y
    # mse
    # return (h_out - y) * derivative_f(z_out)


def calculation_layer_difference(y, h_out):
    return h_out - y


def calculation_hidden_layer_delta(delta_layer_delta, w_l, z_l):
    return np.dot(np.transpose(w_l), delta_layer_delta) * derivative_f(z_l)


def predict_y(Weights, betta, X, Y):
    volume_data = len(Y)

    true_pos = 0
    true_neg = 0
    false_pos = 0
    false_neg = 0

    for j in range(volume_data):
        h, z = calculation_of_sum_and_F_activation(X[j, :], Weights, betta)
        if h[3] >= 0.5:
            answer = 1
        else:
            answer = 0

        if Y[j, 0] == 1 and answer == 1:
            true_pos = true_pos + 1
        if Y[j, 0] == 1 and answer == 0:
            false_neg = false_neg + 1
        if Y[j, 0] == 0 and answer == 1:
            false_pos = false_pos + 1
        if Y[j, 0] == 0 and answer == 0:
            true_neg = true_neg + 1

    print(true_pos, true_neg, false_pos, false_neg)
    accuracy = (true_pos + true_neg) / volume_data
    print('accuracy', accuracy)
    return accuracy


def getPrediction(x, y):
    # step
    alpha = 0.01

    # network config
    enter = len(x[0])
    exit = 1
    hidden_layout = (enter + exit) // 2
    structure = [enter, hidden_layout, exit]

    epoch = 600

    # write to file data of experiment
    c = 0
    file = open('text.txt', 'w')
    for index in x:
        file.write(str(int(y[c, 0])) + ' ')
        for item in index:
            file.write(str(item) + ' ')
        file.write('\n')
        c = c + 1

    trainData = len(x) * 80 // 100

    X_train = np.vstack((x[0:trainData, 0:enter]))
    Y_train = np.vstack((y[0:trainData, 0]))
    X_test = np.vstack((x[trainData:len(x), 0:enter]))
    Y_test = np.vstack((y[trainData:len(x), 0]))

    W, b = setup_and_init_weights(structure)

    counter = 0
    loss_train_func = []
    loss_func = []
    while counter < epoch:
        W_delta, b_delta = init_delta_values(structure)
        loss = 0
        i = 0
        for i in range(len(Y_train)):
            delta = {}
            h, z = calculation_of_sum_and_F_activation(X_train[i, :], W, b)
            delta[3] = calculation_layer_delta(Y_train[i, 0], h[3], z[3])
            # loss += pow((Y_train[i, 0] - h[3]), 2)
            loss = loss + (- np.multiply(Y_train[i, 0], np.log(h[3] + 0.0000000001)) - np.multiply(1.0 - Y_train[i, 0], np.log(1.0 - h[3] + 0.0000000001))).sum()
            # delta[2] = np.multiply(delta[3] * W[2][:, 0: -1], np.multiply(h[3], 1.0 - h[3]))
            delta[2] = calculation_hidden_layer_delta(delta[3], W[2], z[2])
            W_delta[2] = np.dot(delta[3][:, np.newaxis], np.transpose(h[2][:, np.newaxis]))
            b_delta[2] = delta[3]
            W_delta[1] = np.dot(delta[2][:, np.newaxis], np.transpose(h[1][:, np.newaxis]))
            b_delta[1] = delta[2]

            W[1] = W[1] - alpha * W_delta[1]
            b[1] = b[1] - alpha * b_delta[1]
            W[2] = W[2] - alpha * W_delta[2]
            b[2] = b[2] - alpha * b_delta[2]

        loss = loss / len(Y_train)

        loss_train = 0
        for j in range(len(Y_test)):
            gg, ll = calculation_of_sum_and_F_activation(X_test[j, :], W, b)
            loss_train = loss_train + (- np.multiply(Y_test[j, 0], np.log(gg[3] + 0.0000000001)) - np.multiply(1.0 - Y_test[j, 0], np.log(1.0 - gg[3] + 0.0000000001))).sum()
        loss_train = loss_train / len(Y_test)

        if counter == 1:
            print(loss)
        if counter == 50:
            print(loss)
        if counter == 100:
            print(loss)
        if counter == 200:
            print(loss)
        if counter == 300:
            print(loss)
        if counter == 400:
            print(loss)
        if counter == 499:
            print(loss)
        loss_func.append(loss)
        loss_train_func.append(loss_train)
        counter += 1

    plt.plot(loss_func)
    plt.ylabel('Погрешность')
    plt.xlabel('Количество итераций')
    plt.show()

    predict_y(W, b, X_test, Y_test)
